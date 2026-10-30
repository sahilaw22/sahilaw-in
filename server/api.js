import express from 'express';
import db from './db.js';
import { selectAnswer } from './matchingEngine.js';
import { hashPassword, verifyPassword, generateToken, authMiddleware } from './auth.js';

const router = express.Router();

// Helper to get active templates as a map { greeting: '...', fallback: '...' }
function getTemplatesMap() {
  const rows = db.getTemplates();
  const map = {};
  for (const r of rows) map[r.key] = r.template;
  return map;
}

// -------------------------------------------------------------
// PUBLIC CHAT ENDPOINTS
// -------------------------------------------------------------

/**
 * POST /api/chat
 * Handles visitor questions using pure deterministic matching.
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId = 'anon', conversationId: providedConvId } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Rate limiting check
    const settings = db.getSettings();
    const rateLimit = parseInt(settings.rateLimitPerMin || '30', 10);
    // (Simple session window check if needed)

    // Ensure conversation exists
    let conversation;
    if (providedConvId) {
      conversation = db.getConversation(providedConvId);
    }
    if (!conversation) {
      conversation = db.getOrCreateConversation(sessionId);
    }

    // Save visitor message
    const userMsg = db.addMessage({
      conversationId: conversation.id,
      sender: 'user',
      text: message.trim(),
    });

    // Build conversation context from previous assistant message
    let conversationContext = {};
    if (conversation.messages && conversation.messages.length > 0) {
      const lastAssistantMsg = [...conversation.messages]
        .reverse()
        .find((m) => m.sender === 'assistant' && m.matched_knowledge_id);

      if (lastAssistantMsg && lastAssistantMsg.matched_knowledge_id) {
        const lastEntry = db.getKnowledgeEntryById(lastAssistantMsg.matched_knowledge_id);
        if (lastEntry) {
          conversationContext.lastKnowledgeEntry = lastEntry;
        }
      }
    }

    // Load active knowledge entries & templates from persistent DB
    const knowledgeEntries = db.getKnowledgeEntries({ activeOnly: true });
    const templates = getTemplatesMap();

    // Execute deterministic matching engine (0 LLM calls)
    const result = selectAnswer({
      message: message.trim(),
      knowledgeEntries,
      templates,
      settings,
      conversationContext,
    });

    // Save assistant message to DB
    const assistantMsg = db.addMessage({
      conversationId: conversation.id,
      sender: 'assistant',
      text: result.answer,
      matchedKnowledgeId: result.matchedKnowledgeId,
      confidence: result.confidence,
      intent: result.intent,
      metadata: {
        links: result.links,
        ...result.metadata,
      },
    });

    // If result was fallback or insufficient confidence, record in unanswered_questions queue
    // (Ignore routine short greetings or acknowledgements)
    if (result.intent === 'fallback' || result.intent === 'ambiguous_clarification') {
      const trimmed = message.trim();
      if (trimmed.length > 3 && !['hi', 'hello', 'hey', 'ok', 'okay', 'bye'].includes(trimmed.toLowerCase())) {
        db.recordUnansweredQuestion(
          trimmed,
          trimmed.toLowerCase(),
          result.metadata?.reason || result.intent
        );
      }
    }

    return res.json({
      answer: result.answer,
      links: result.links || [],
      confidence: result.confidence,
      intent: result.intent,
      matchedKnowledgeId: result.matchedKnowledgeId,
      conversationId: conversation.id,
      messageId: assistantMsg.id,
    });
  } catch (err) {
    console.error('Chat API Error:', err);
    return res.status(500).json({ error: 'Internal assistant error' });
  }
});

/**
 * POST /api/chat/feedback
 * Records user feedback (1 = thumbs up, -1 = thumbs down).
 */
router.post('/chat/feedback', (req, res) => {
  try {
    const { messageId, rating, comment = '' } = req.body;
    if (!messageId || ![1, -1].includes(rating)) {
      return res.status(400).json({ error: 'Valid messageId and rating (1 or -1) are required.' });
    }

    const saved = db.addFeedback(messageId, rating, comment);
    return res.json({ success: true, feedback: saved });
  } catch (err) {
    console.error('Feedback API Error:', err);
    return res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

/**
 * POST /api/admin/login
 */
router.post('/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = db.getAdminByUsername(username.trim());
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isValid = verifyPassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    db.updateAdminLastLogin(admin.id);
    db.addAuditLog('admin_login', `Admin ${admin.username} logged in.`);

    const token = generateToken({ id: admin.id, username: admin.username });
    return res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
});

/**
 * POST /api/admin/logout
 */
router.post('/admin/logout', authMiddleware, (req, res) => {
  db.addAuditLog('admin_logout', `Admin ${req.admin.username} logged out.`);
  return res.json({ success: true });
});

/**
 * GET /api/admin/me
 */
router.get('/admin/me', authMiddleware, (req, res) => {
  const admin = db.getAdminById(req.admin.id);
  if (!admin) return res.status(404).json({ error: 'Admin not found.' });
  return res.json({ admin });
});

/**
 * PATCH /api/admin/password
 */
router.patch('/admin/password', authMiddleware, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const admin = db.getAdminByUsername(req.admin.username);
    if (!verifyPassword(currentPassword, admin.password_hash)) {
      return res.status(400).json({ error: 'Current password incorrect.' });
    }

    const newHash = hashPassword(newPassword);
    db.updateAdminPassword(admin.id, newHash);
    db.addAuditLog('admin_change_password', `Admin ${admin.username} changed their password.`);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update password.' });
  }
});

// -------------------------------------------------------------
// ADMIN MANAGEMENT ENDPOINTS (PROTECTED)
// -------------------------------------------------------------

/**
 * GET /api/admin/analytics
 */
router.get('/admin/analytics', authMiddleware, (req, res) => {
  try {
    const analytics = db.getAnalytics();
    return res.json(analytics);
  } catch (err) {
    console.error('Analytics Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

/**
 * GET /api/admin/conversations
 */
router.get('/admin/conversations', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all', search = '' } = req.query;
    const data = db.listConversations({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
      search,
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list conversations' });
  }
});

/**
 * GET /api/admin/conversations/:id
 */
router.get('/admin/conversations/:id', authMiddleware, (req, res) => {
  try {
    const conv = db.getConversation(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    return res.json(conv);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get conversation' });
  }
});

/**
 * PATCH /api/admin/conversations/:id/status
 */
router.patch('/admin/conversations/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'reviewed', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    db.updateConversationStatus(req.params.id, status);
    return res.json({ success: true, id: req.params.id, status });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update conversation status' });
  }
});

/**
 * GET /api/admin/unanswered
 */
router.get('/admin/unanswered', authMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all', search = '' } = req.query;
    const data = db.listUnansweredQuestions({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
      search,
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list unanswered questions' });
  }
});

/**
 * PATCH /api/admin/unanswered/:id
 */
router.patch('/admin/unanswered/:id', authMiddleware, (req, res) => {
  try {
    const updated = db.updateUnansweredQuestion(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update question' });
  }
});

/**
 * POST /api/admin/unanswered/:id/convert
 * Converts an unanswered question into a newly published knowledge entry.
 */
router.post('/api/admin/unanswered/:id/convert', authMiddleware, (req, res) => {
  try {
    const { canonical_question, answer, category = 'General', aliases = [], keywords = [], links = [] } = req.body;
    if (!canonical_question || !answer) {
      return res.status(400).json({ error: 'Canonical question and answer are required.' });
    }

    const newKb = db.createKnowledgeEntry({
      canonical_question,
      answer,
      category,
      aliases,
      keywords,
      links,
      is_active: true,
    });

    db.updateUnansweredQuestion(req.params.id, {
      status: 'answered',
      linked_knowledge_id: newKb.id,
      admin_notes: `Converted to knowledge entry ${newKb.id} by ${req.admin.username}`,
    });

    db.addAuditLog('convert_unanswered', `Unanswered question ${req.params.id} converted to ${newKb.id}`);

    return res.json({ success: true, knowledgeEntry: newKb });
  } catch (err) {
    console.error('Convert Unanswered Error:', err);
    return res.status(500).json({ error: 'Failed to convert question' });
  }
});

/**
 * GET /api/admin/knowledge
 */
router.get('/admin/knowledge', authMiddleware, (req, res) => {
  try {
    const entries = db.getKnowledgeEntries();
    return res.json({ items: entries });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list knowledge entries' });
  }
});

/**
 * POST /api/admin/knowledge
 */
router.post('/admin/knowledge', authMiddleware, (req, res) => {
  try {
    const { canonical_question, answer, category = 'General', aliases = [], keywords = [], links = [], related_entities = [], is_active = true } = req.body;
    if (!canonical_question || !answer) {
      return res.status(400).json({ error: 'Canonical question and answer are required.' });
    }

    const created = db.createKnowledgeEntry({
      canonical_question,
      answer,
      category,
      aliases,
      keywords,
      links,
      related_entities,
      is_active,
    });

    db.addAuditLog('create_knowledge', `Knowledge entry created: "${canonical_question}"`);
    return res.status(201).json({ success: true, item: created });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create knowledge entry' });
  }
});

/**
 * PATCH /api/admin/knowledge/:id
 */
router.patch('/admin/knowledge/:id', authMiddleware, (req, res) => {
  try {
    const updated = db.updateKnowledgeEntry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Knowledge entry not found' });

    db.addAuditLog('update_knowledge', `Knowledge entry updated: ${req.params.id}`);
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update knowledge entry' });
  }
});

/**
 * DELETE /api/admin/knowledge/:id
 */
router.delete('/admin/knowledge/:id', authMiddleware, (req, res) => {
  try {
    db.deleteKnowledgeEntry(req.params.id);
    db.addAuditLog('delete_knowledge', `Knowledge entry deleted: ${req.params.id}`);
    return res.json({ success: true, id: req.params.id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete knowledge entry' });
  }
});

/**
 * GET /api/admin/templates
 */
router.get('/admin/templates', authMiddleware, (req, res) => {
  try {
    const templates = db.getTemplates();
    return res.json({ items: templates });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list templates' });
  }
});

/**
 * PATCH /api/admin/templates/:key
 */
router.patch('/admin/templates/:key', authMiddleware, (req, res) => {
  try {
    const { template } = req.body;
    if (!template || typeof template !== 'string') {
      return res.status(400).json({ error: 'Template content is required.' });
    }
    db.updateTemplate(req.params.key, template);
    db.addAuditLog('update_template', `Template updated: ${req.params.key}`);
    return res.json({ success: true, key: req.params.key, template });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update template' });
  }
});

/**
 * GET /api/admin/settings
 */
router.get('/admin/settings', authMiddleware, (req, res) => {
  try {
    const settings = db.getSettings();
    return res.json({ settings });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get settings' });
  }
});

/**
 * PATCH /api/admin/settings
 */
router.patch('/admin/settings', authMiddleware, (req, res) => {
  try {
    const updates = req.body;
    for (const [k, v] of Object.entries(updates)) {
      db.updateSetting(k, v);
    }
    db.addAuditLog('update_settings', `Settings updated: ${Object.keys(updates).join(', ')}`);
    return res.json({ success: true, settings: db.getSettings() });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * POST /api/admin/test-match (Sandbox / Matching Preview Tool)
 */
router.post('/admin/test-match', authMiddleware, (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const knowledgeEntries = db.getKnowledgeEntries();
    const templates = getTemplatesMap();
    const settings = db.getSettings();

    const result = selectAnswer({
      message: query,
      knowledgeEntries,
      templates,
      settings,
    });

    return res.json({
      query,
      result,
      settings: {
        confidenceThreshold: settings.confidenceThreshold,
        ambiguityThreshold: settings.ambiguityThreshold,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Matching preview failed' });
  }
});

/**
 * -------------------------------------------------------------
 * PORTFOLIO CONTENT MANAGEMENT (PUBLIC & ADMIN REAL-TIME)
 * -------------------------------------------------------------
 */

/**
 * GET /api/portfolio-content
 * Returns all dynamic portfolio content (about, experiences, education, skills, meta)
 */
router.get('/portfolio-content', (req, res) => {
  try {
    const content = db.getPortfolioContent();
    return res.json({ success: true, content });
  } catch (err) {
    console.error('Error fetching portfolio content:', err);
    return res.status(500).json({ error: 'Failed to fetch portfolio content.' });
  }
});

/**
 * GET /api/portfolio-content/:section
 */
router.get('/portfolio-content/:section', (req, res) => {
  try {
    const sectionData = db.getPortfolioSection(req.params.section);
    if (!sectionData) {
      return res.status(404).json({ error: `Section ${req.params.section} not found.` });
    }
    return res.json({ success: true, section: req.params.section, data: sectionData });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch section content.' });
  }
});

/**
 * PUT /api/admin/portfolio-content/:section
 * Updates portfolio section in SQLite DB in real time.
 */
router.put('/admin/portfolio-content/:section', authMiddleware, (req, res) => {
  try {
    const { section } = req.params;
    const { data } = req.body;
    if (data === undefined) {
      return res.status(400).json({ error: 'Data is required.' });
    }

    db.updatePortfolioSection(section, data);
    db.addAuditLog('update_portfolio_content', `Admin updated section: ${section}`);
    return res.json({ success: true, section, data });
  } catch (err) {
    console.error(`Error updating section ${req.params.section}:`, err);
    return res.status(500).json({ error: 'Failed to update section content.' });
  }
});

/**
 * GET /api/admin/portfolio-export-zip
 * Generates and downloads a complete structured ZIP package of the portfolio
 * including all content sections, knowledge base entries, and extracted custom logos.
 */
router.get('/admin/portfolio-export-zip', authMiddleware, async (req, res) => {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const content = db.getPortfolioContent();
    const knowledge = db.getAllKnowledge();
    const templates = db.getAllTemplates();
    const settings = db.getSettings();

    // 1. Root master JSON
    zip.file('portfolio-data.json', JSON.stringify(content, null, 2));

    // 2. Data directory with modular JSON files
    const dataFolder = zip.folder('data');
    dataFolder.file('about.json', JSON.stringify(content.about || [], null, 2));
    dataFolder.file('experiences.json', JSON.stringify(content.experiences || [], null, 2));
    dataFolder.file('education.json', JSON.stringify(content.education || [], null, 2));
    dataFolder.file('skills.json', JSON.stringify(content.skills || [], null, 2));
    dataFolder.file('meta.json', JSON.stringify(content.meta || {}, null, 2));
    dataFolder.file('knowledge-base.json', JSON.stringify(knowledge || [], null, 2));
    dataFolder.file('templates.json', JSON.stringify(templates || {}, null, 2));
    dataFolder.file('settings.json', JSON.stringify(settings || {}, null, 2));

    // 3. Extract and save uploaded custom logos into assets/logos/
    const logosFolder = zip.folder('assets/logos');
    let extractedLogosCount = 0;

    if (Array.isArray(content.skills)) {
      content.skills.forEach((category) => {
        if (Array.isArray(category.skills)) {
          category.skills.forEach((skill) => {
            if (typeof skill === 'object' && skill?.logoUrl && skill.logoUrl.startsWith('data:image/')) {
              const mimeMatch = skill.logoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
              const ext = mimeMatch ? (mimeMatch[1] === 'svg+xml' ? 'svg' : mimeMatch[1]) : 'png';
              const base64Data = skill.logoUrl.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
              const filename = `${(skill.name || 'skill').toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.${ext}`;
              logosFolder.file(filename, base64Data, { base64: true });
              extractedLogosCount++;
            }
          });
        }
      });
    }

    // 4. Manifest
    const manifest = {
      name: 'Sahil Portfolio Export Package',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      stats: {
        experiences: (content.experiences || []).length,
        education: (content.education || []).length,
        skillsCategories: (content.skills || []).length,
        knowledgeEntries: (knowledge || []).length,
        extractedLogos: extractedLogosCount,
      },
    };
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    // 5. Human guide
    zip.file(
      'README.md',
      `# Portfolio Export Package\n\nExported on ${new Date().toUTCString()}\n\n## Structure\n- \`portfolio-data.json\`: Consolidated full portfolio schema\n- \`data/\`: Modular JSON files for each section\n- \`assets/logos/\`: Extracted custom logos uploaded via Admin\n- \`manifest.json\`: Export metadata and statistics\n`
    );

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const filename = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(zipBuffer);
  } catch (err) {
    console.error('Error generating export ZIP:', err);
    return res.status(500).json({ error: 'Failed to generate ZIP archive: ' + err.message });
  }
});

export default router;

