import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_KNOWLEDGE_ENTRIES, INITIAL_SETTINGS, INITIAL_TEMPLATES } from './knowledgeSeed.js';
import { DEFAULT_PORTFOLIO_CONTENT } from './defaultContent.js';
import { hashPassword } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data/assistant-db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'portfolio.db');
const JSON_BACKUP_PATH = path.join(DATA_DIR, 'portfolio.json');

// Try loading built-in node:sqlite
let DatabaseSync = null;
try {
  const sqlite = await import('node:sqlite');
  DatabaseSync = sqlite.DatabaseSync;
} catch (err) {
  // node:sqlite not available; fallback to JSON storage
}

class SqliteStorage {
  constructor(dbPath) {
    this.db = new DatabaseSync(dbPath);
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        last_login INTEGER
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS templates (
        key TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        template TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS knowledge_entries (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        canonical_question TEXT NOT NULL,
        answer TEXT NOT NULL,
        links_json TEXT,
        related_entities_json TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS question_aliases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        knowledge_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (knowledge_id) REFERENCES knowledge_entries(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS knowledge_keywords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        knowledge_id TEXT NOT NULL,
        keyword TEXT NOT NULL,
        weight REAL NOT NULL DEFAULT 1.0,
        FOREIGN KEY (knowledge_id) REFERENCES knowledge_entries(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        total_messages INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        matched_knowledge_id TEXT,
        confidence REAL,
        intent TEXT,
        metadata_json TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS unanswered_questions (
        id TEXT PRIMARY KEY,
        raw_question TEXT NOT NULL,
        normalized_question TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        first_seen INTEGER NOT NULL,
        last_seen INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        match_reason TEXT,
        admin_notes TEXT,
        linked_knowledge_id TEXT
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        message_id TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS portfolio_content (
        section TEXT PRIMARY KEY,
        data_json TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_aliases_text ON question_aliases(question_text);
      CREATE INDEX IF NOT EXISTS idx_keywords_word ON knowledge_keywords(keyword);
      CREATE INDEX IF NOT EXISTS idx_conv_updated ON conversations(updated_at);
      CREATE INDEX IF NOT EXISTS idx_unanswered_norm ON unanswered_questions(normalized_question);
    `);
  }

  // --- Seed Initialization ---
  seedInitialData() {
    // 1. Seed / Update Settings
    const insertSetting = this.db.prepare(`
      INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);
    for (const s of INITIAL_SETTINGS) {
      insertSetting.run(s.key, s.value, Date.now());
    }

    // 2. Seed Templates
    const existingTemplates = this.db.prepare('SELECT COUNT(*) as count FROM templates').get();
    if (existingTemplates.count === 0) {
      const insertTemplate = this.db.prepare('INSERT INTO templates (key, name, template, updated_at) VALUES (?, ?, ?, ?)');
      for (const t of INITIAL_TEMPLATES) {
        insertTemplate.run(t.key, t.name, t.template, Date.now());
      }
    }

    // 3. Seed Knowledge Base
    const existingKnowledge = this.db.prepare('SELECT COUNT(*) as count FROM knowledge_entries').get();
    if (existingKnowledge.count === 0) {
      for (const item of INITIAL_KNOWLEDGE_ENTRIES) {
        this.createKnowledgeEntry(item);
      }
    }

    // 4. Seed / Update Default Admin to sahil@admin
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'sahil@admin';
    const hash = hashPassword(defaultPassword);
    const existingAdmin = this.db.prepare("SELECT * FROM admins WHERE username = 'admin'").get();
    if (!existingAdmin) {
      this.db
        .prepare('INSERT INTO admins (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)')
        .run('admin-default', 'admin', hash, Date.now());
    } else {
      this.db
        .prepare("UPDATE admins SET password_hash = ? WHERE username = 'admin'")
        .run(hash);
    }

    // 5. Seed Portfolio Content Persistence
    const existingContent = this.db.prepare('SELECT COUNT(*) as count FROM portfolio_content').get();
    if (existingContent.count === 0) {
      const insertContent = this.db.prepare('INSERT INTO portfolio_content (section, data_json, updated_at) VALUES (?, ?, ?)');
      for (const [section, data] of Object.entries(DEFAULT_PORTFOLIO_CONTENT)) {
        insertContent.run(section, JSON.stringify(data), Date.now());
      }
    }
  }

  // Reload/re-seed updated knowledge entries and templates
  reseedKnowledge() {
    this.db.prepare('DELETE FROM question_aliases').run();
    this.db.prepare('DELETE FROM knowledge_keywords').run();
    this.db.prepare('DELETE FROM knowledge_entries').run();
    for (const item of INITIAL_KNOWLEDGE_ENTRIES) {
      this.createKnowledgeEntry(item);
    }
    for (const t of INITIAL_TEMPLATES) {
      this.db
        .prepare(
          'INSERT INTO templates (key, name, template, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET template = excluded.template, updated_at = excluded.updated_at'
        )
        .run(t.key, t.name, t.template, Date.now());
    }
    for (const s of INITIAL_SETTINGS) {
      this.db
        .prepare(
          'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
        )
        .run(s.key, s.value, Date.now());
    }
  }

  // --- Settings ---
  getSettings() {
    const rows = this.db.prepare('SELECT key, value FROM settings').all();
    const result = {};
    for (const r of rows) result[r.key] = r.value;
    return result;
  }

  getSetting(key) {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  }

  updateSetting(key, value) {
    this.db.prepare('INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at').run(key, String(value), Date.now());
  }

  // --- Templates ---
  getTemplates() {
    return this.db.prepare('SELECT key, name, template, updated_at FROM templates').all();
  }

  getTemplate(key) {
    const row = this.db.prepare('SELECT template FROM templates WHERE key = ?').get(key);
    return row ? row.template : null;
  }

  updateTemplate(key, template) {
    this.db.prepare('UPDATE templates SET template = ?, updated_at = ? WHERE key = ?').run(template, Date.now(), key);
  }

  // --- Knowledge Base ---
  getKnowledgeEntries(filter = {}) {
    let sql = 'SELECT * FROM knowledge_entries';
    const params = [];
    if (filter.activeOnly) {
      sql += ' WHERE is_active = 1';
    }
    sql += ' ORDER BY category ASC, canonical_question ASC';
    const entries = this.db.prepare(sql).all(...params);

    const getAliases = this.db.prepare('SELECT question_text FROM question_aliases WHERE knowledge_id = ?');
    const getKeywords = this.db.prepare('SELECT keyword, weight FROM knowledge_keywords WHERE knowledge_id = ?');

    return entries.map((e) => {
      const aliases = getAliases.all(e.id).map((r) => r.question_text);
      const keywords = getKeywords.all(e.id).map((r) => r.keyword);
      return {
        id: e.id,
        category: e.category,
        canonical_question: e.canonical_question,
        answer: e.answer,
        links: e.links_json ? JSON.parse(e.links_json) : [],
        related_entities: e.related_entities_json ? JSON.parse(e.related_entities_json) : [],
        is_active: Boolean(e.is_active),
        aliases,
        keywords,
        created_at: e.created_at,
        updated_at: e.updated_at,
      };
    });
  }

  getKnowledgeEntryById(id) {
    const e = this.db.prepare('SELECT * FROM knowledge_entries WHERE id = ?').get(id);
    if (!e) return null;
    const aliases = this.db.prepare('SELECT question_text FROM question_aliases WHERE knowledge_id = ?').all(id).map((r) => r.question_text);
    const keywords = this.db.prepare('SELECT keyword, weight FROM knowledge_keywords WHERE knowledge_id = ?').all(id).map((r) => r.keyword);
    return {
      id: e.id,
      category: e.category,
      canonical_question: e.canonical_question,
      answer: e.answer,
      links: e.links_json ? JSON.parse(e.links_json) : [],
      related_entities: e.related_entities_json ? JSON.parse(e.related_entities_json) : [],
      is_active: Boolean(e.is_active),
      aliases,
      keywords,
      created_at: e.created_at,
      updated_at: e.updated_at,
    };
  }

  createKnowledgeEntry(data) {
    const id = data.id || `kb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    this.db.prepare(`
      INSERT INTO knowledge_entries (id, category, canonical_question, answer, links_json, related_entities_json, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.category || 'General',
      data.canonical_question,
      data.answer,
      JSON.stringify(data.links || []),
      JSON.stringify(data.related_entities || []),
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      now,
      now
    );

    // Aliases
    const insertAlias = this.db.prepare('INSERT INTO question_aliases (knowledge_id, question_text, created_at) VALUES (?, ?, ?)');
    if (Array.isArray(data.aliases)) {
      for (const a of data.aliases) {
        if (a && typeof a === 'string') insertAlias.run(id, a.trim().toLowerCase(), now);
      }
    }

    // Keywords
    const insertKw = this.db.prepare('INSERT INTO knowledge_keywords (knowledge_id, keyword, weight) VALUES (?, ?, ?)');
    if (Array.isArray(data.keywords)) {
      for (const kw of data.keywords) {
        if (kw && typeof kw === 'string') insertKw.run(id, kw.trim().toLowerCase(), 1.0);
      }
    }

    return this.getKnowledgeEntryById(id);
  }

  updateKnowledgeEntry(id, fields) {
    const existing = this.getKnowledgeEntryById(id);
    if (!existing) return null;
    const now = Date.now();

    this.db.prepare(`
      UPDATE knowledge_entries
      SET category = ?, canonical_question = ?, answer = ?, links_json = ?, related_entities_json = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `).run(
      fields.category !== undefined ? fields.category : existing.category,
      fields.canonical_question !== undefined ? fields.canonical_question : existing.canonical_question,
      fields.answer !== undefined ? fields.answer : existing.answer,
      fields.links !== undefined ? JSON.stringify(fields.links) : JSON.stringify(existing.links),
      fields.related_entities !== undefined ? JSON.stringify(fields.related_entities) : JSON.stringify(existing.related_entities),
      fields.is_active !== undefined ? (fields.is_active ? 1 : 0) : (existing.is_active ? 1 : 0),
      now,
      id
    );

    if (Array.isArray(fields.aliases)) {
      this.db.prepare('DELETE FROM question_aliases WHERE knowledge_id = ?').run(id);
      const insertAlias = this.db.prepare('INSERT INTO question_aliases (knowledge_id, question_text, created_at) VALUES (?, ?, ?)');
      for (const a of fields.aliases) {
        if (a && typeof a === 'string') insertAlias.run(id, a.trim().toLowerCase(), now);
      }
    }

    if (Array.isArray(fields.keywords)) {
      this.db.prepare('DELETE FROM knowledge_keywords WHERE knowledge_id = ?').run(id);
      const insertKw = this.db.prepare('INSERT INTO knowledge_keywords (knowledge_id, keyword, weight) VALUES (?, ?, ?)');
      for (const kw of fields.keywords) {
        if (kw && typeof kw === 'string') insertKw.run(id, kw.trim().toLowerCase(), 1.0);
      }
    }

    return this.getKnowledgeEntryById(id);
  }

  deleteKnowledgeEntry(id) {
    this.db.prepare('DELETE FROM question_aliases WHERE knowledge_id = ?').run(id);
    this.db.prepare('DELETE FROM knowledge_keywords WHERE knowledge_id = ?').run(id);
    this.db.prepare('DELETE FROM knowledge_entries WHERE id = ?').run(id);
    return true;
  }

  // --- Admins ---
  getAdminByUsername(username) {
    return this.db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  }

  getAdminById(id) {
    return this.db.prepare('SELECT id, username, created_at, last_login FROM admins WHERE id = ?').get(id);
  }

  updateAdminPassword(id, newHash) {
    this.db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, id);
  }

  updateAdminLastLogin(id) {
    this.db.prepare('UPDATE admins SET last_login = ? WHERE id = ?').run(Date.now(), id);
  }

  // --- Conversations & Messages ---
  getOrCreateConversation(sessionId) {
    const existing = this.db.prepare('SELECT * FROM conversations WHERE session_id = ? ORDER BY updated_at DESC LIMIT 1').get(sessionId);
    if (existing) return existing;

    const id = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = Date.now();
    this.db.prepare('INSERT INTO conversations (id, session_id, status, created_at, updated_at, total_messages) VALUES (?, ?, ?, ?, ?, ?)').run(id, sessionId, 'active', now, now, 0);
    return { id, session_id: sessionId, status: 'active', created_at: now, updated_at: now, total_messages: 0 };
  }

  getConversation(id) {
    const conv = this.db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
    if (!conv) return null;
    const messages = this.db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(id).map((m) => ({
      ...m,
      metadata: m.metadata_json ? JSON.parse(m.metadata_json) : null,
    }));
    return { ...conv, messages };
  }

  listConversations({ page = 1, limit = 20, status, search }) {
    let sql = 'SELECT * FROM conversations';
    const where = [];
    const params = [];

    if (status && status !== 'all') {
      where.push('status = ?');
      params.push(status);
    }
    if (search) {
      where.push('id IN (SELECT DISTINCT conversation_id FROM messages WHERE text LIKE ?)');
      params.push(`%${search}%`);
    }

    if (where.length) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalRow = this.db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    sql += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const rows = this.db.prepare(sql).all(...params);
    return {
      items: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  updateConversationStatus(id, status) {
    this.db.prepare('UPDATE conversations SET status = ?, updated_at = ? WHERE id = ?').run(status, Date.now(), id);
  }

  addMessage({ conversationId, sender, text, matchedKnowledgeId = null, confidence = 0, intent = 'general', metadata = {} }) {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = Date.now();
    this.db.prepare(`
      INSERT INTO messages (id, conversation_id, sender, text, matched_knowledge_id, confidence, intent, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, conversationId, sender, text, matchedKnowledgeId, confidence, intent, JSON.stringify(metadata), now);

    this.db.prepare('UPDATE conversations SET updated_at = ?, total_messages = total_messages + 1 WHERE id = ?').run(now, conversationId);
    return { id, conversation_id: conversationId, sender, text, matched_knowledge_id: matchedKnowledgeId, confidence, intent, metadata, created_at: now };
  }

  // --- Unanswered Questions ---
  recordUnansweredQuestion(rawQuestion, normalizedQuestion, matchReason = 'no_match') {
    const existing = this.db.prepare('SELECT * FROM unanswered_questions WHERE normalized_question = ?').get(normalizedQuestion);
    const now = Date.now();
    if (existing) {
      this.db.prepare(`
        UPDATE unanswered_questions
        SET count = count + 1, last_seen = ?, match_reason = ?, raw_question = ?
        WHERE id = ?
      `).run(now, matchReason, rawQuestion, existing.id);
      return existing.id;
    } else {
      const id = `unans-${now}-${Math.random().toString(36).substring(2, 6)}`;
      this.db.prepare(`
        INSERT INTO unanswered_questions (id, raw_question, normalized_question, count, first_seen, last_seen, status, match_reason)
        VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
      `).run(id, rawQuestion, normalizedQuestion, 1, now, now, matchReason);
      return id;
    }
  }

  listUnansweredQuestions({ page = 1, limit = 20, status = 'all', search = '' }) {
    let sql = 'SELECT * FROM unanswered_questions';
    const where = [];
    const params = [];

    if (status && status !== 'all') {
      where.push('status = ?');
      params.push(status);
    }
    if (search) {
      where.push('(raw_question LIKE ? OR normalized_question LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (where.length) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalRow = this.db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    sql += ' ORDER BY count DESC, last_seen DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const rows = this.db.prepare(sql).all(...params);
    return {
      items: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  updateUnansweredQuestion(id, updates) {
    const existing = this.db.prepare('SELECT * FROM unanswered_questions WHERE id = ?').get(id);
    if (!existing) return null;

    const newStatus = updates.status !== undefined ? updates.status : existing.status;
    const newNotes = updates.admin_notes !== undefined ? updates.admin_notes : existing.admin_notes;
    const newLinkedId = updates.linked_knowledge_id !== undefined ? updates.linked_knowledge_id : existing.linked_knowledge_id;

    this.db.prepare(`
      UPDATE unanswered_questions
      SET status = ?, admin_notes = ?, linked_knowledge_id = ?
      WHERE id = ?
    `).run(newStatus, newNotes, newLinkedId, id);

    return this.db.prepare('SELECT * FROM unanswered_questions WHERE id = ?').get(id);
  }

  // --- Feedback ---
  addFeedback(messageId, rating, comment = '') {
    const id = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.db.prepare('INSERT INTO feedback (id, message_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)').run(id, messageId, rating, comment, Date.now());
    return { id, messageId, rating, comment };
  }

  // --- Analytics ---
  getAnalytics() {
    const totalConversations = this.db.prepare('SELECT COUNT(*) as c FROM conversations').get().c;
    const totalMessages = this.db.prepare("SELECT COUNT(*) as c FROM messages WHERE sender = 'user'").get().c;
    const answeredMessages = this.db.prepare("SELECT COUNT(*) as c FROM messages WHERE sender = 'assistant' AND matched_knowledge_id IS NOT NULL").get().c;
    const fallbackMessages = this.db.prepare("SELECT COUNT(*) as c FROM messages WHERE sender = 'assistant' AND intent = 'fallback'").get().c;
    const totalUnanswered = this.db.prepare('SELECT COUNT(*) as c FROM unanswered_questions').get().c;
    const newUnanswered = this.db.prepare("SELECT COUNT(*) as c FROM unanswered_questions WHERE status = 'new'").get().c;
    const totalKnowledge = this.db.prepare('SELECT COUNT(*) as c FROM knowledge_entries WHERE is_active = 1').get().c;

    const topQuestions = this.db.prepare(`
      SELECT m.text, COUNT(*) as frequency
      FROM messages m
      WHERE m.sender = 'user'
      GROUP BY m.text
      ORDER BY frequency DESC
      LIMIT 6
    `).all();

    const topAnswers = this.db.prepare(`
      SELECT k.canonical_question, k.category, COUNT(*) as usage_count
      FROM messages m
      JOIN knowledge_entries k ON m.matched_knowledge_id = k.id
      GROUP BY m.matched_knowledge_id
      ORDER BY usage_count DESC
      LIMIT 6
    `).all();

    const feedbackStats = this.db.prepare(`
      SELECT 
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN rating = -1 THEN 1 ELSE 0 END) as negative
      FROM feedback
    `).get() || { positive: 0, negative: 0 };

    return {
      totalConversations,
      totalMessages,
      answeredMessages,
      fallbackMessages,
      fallbackRate: totalMessages > 0 ? Number(((fallbackMessages / totalMessages) * 100).toFixed(1)) : 0,
      totalUnanswered,
      newUnanswered,
      totalKnowledge,
      topQuestions,
      topAnswers,
      feedback: {
        positive: feedbackStats.positive || 0,
        negative: feedbackStats.negative || 0,
      },
    };
  }

  addAuditLog(action, details = '') {
    this.db.prepare('INSERT INTO audit_logs (action, details, created_at) VALUES (?, ?, ?)').run(action, details, Date.now());
  }

  // --- Portfolio Content Dynamic Persistence ---
  getPortfolioContent() {
    const rows = this.db.prepare('SELECT section, data_json FROM portfolio_content').all();
    const result = {};
    for (const r of rows) {
      try {
        result[r.section] = JSON.parse(r.data_json);
      } catch {
        result[r.section] = null;
      }
    }
    return result;
  }

  getPortfolioSection(section) {
    const row = this.db.prepare('SELECT data_json FROM portfolio_content WHERE section = ?').get(section);
    if (!row) return null;
    try {
      return JSON.parse(row.data_json);
    } catch {
      return null;
    }
  }

  updatePortfolioSection(section, data) {
    const jsonStr = JSON.stringify(data);
    const now = Date.now();
    this.db.prepare(`
      INSERT INTO portfolio_content (section, data_json, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(section) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at
    `).run(section, jsonStr, now);
    return data;
  }
}

// Instantiate storage
let dbInstance = null;

if (DatabaseSync) {
  try {
    dbInstance = new SqliteStorage(DB_PATH);
    dbInstance.seedInitialData();
  } catch (e) {
    console.error('Failed to init SqliteStorage:', e.message);
  }
}

export default dbInstance;
