/**
 * Pure Rule-Based Deterministic Answer Selection Engine
 * Strictly NO LLM calls. Deterministic matching with tokenization,
 * intent recognition, entity extraction, context tracking, and scoring.
 */

// Common contractions expansion
const CONTRACTIONS = {
  "what's": 'what is',
  "who's": 'who is',
  "how's": 'how is',
  "where's": 'where is',
  "it's": 'it is',
  "that's": 'that is',
  "can't": 'cannot',
  "won't": 'will not',
  "don't": 'do not',
  "didn't": 'did not',
  "i'm": 'i am',
  "you're": 'you are',
  "i've": 'i have',
  "you've": 'you have',
  "i'd": 'i would',
  "you'd": 'you would',
  "there's": 'there is',
  "let's": 'let us',
};

// Common typos normalization map
const TYPOS = {
  experiance: 'experience',
  experince: 'experience',
  skils: 'skills',
  skil: 'skill',
  projet: 'project',
  projetcs: 'projects',
  projets: 'projects',
  teck: 'tech',
  technolgy: 'technology',
  technolgies: 'technologies',
  reack: 'react',
  fluter: 'flutter',
  resum: 'resume',
  contect: 'contact',
  edication: 'education',
  certifcate: 'certificate',
  certifcates: 'certificates',
  certificats: 'certificates',
  intrenship: 'internship',
  intrenships: 'internships',
};

// Common conversational noise words that do not alter core query intent
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'have', 'has', 'had',
  'i', 'me', 'my', 'myself', 'you', 'your', 'yourself',
  'can', 'could', 'would', 'should', 'will', 'shall', 'may', 'might',
  'please', 'just', 'tell', 'show', 'give', 'about', 'some', 'any',
]);

const GREETING_WORDS = new Set(['hi', 'hello', 'hey', 'yo', 'sup', 'howdy', 'hola', 'greetings']);

// Out of scope topic indicators
const OUT_OF_SCOPE_WORDS = [
  'weather', 'forecast', 'rain', 'temperature',
  'movie', 'movies', 'cinema', 'actor', 'actress', 'film',
  'recipe', 'cook', 'cooking', 'bake', 'food', 'pizza',
  'politics', 'president', 'election', 'minister', 'government',
  'football', 'cricket', 'soccer', 'nba', 'ipl', 'match',
  'bitcoin price', 'crypto price', 'stock price', 'trading signal',
  'write poem', 'tell a joke', 'sing a song', 'love you', 'marry me',
];

export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  let str = text.toLowerCase().trim();

  // Expand contractions
  for (const [contraction, expansion] of Object.entries(CONTRACTIONS)) {
    str = str.replace(new RegExp(`\\b${contraction}\\b`, 'gi'), expansion);
  }

  // Remove punctuation except basic letters, numbers, and spaces
  str = str.replace(/[^a-z0-9\s]/g, ' ');

  // Normalize typos
  const words = str.split(/\s+/).filter(Boolean);
  const normalizedWords = words.map((w) => TYPOS[w] || w);
  return normalizedWords.join(' ').trim();
}

export function extractTokens(normalizedText) {
  return normalizedText
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

// Levenshtein distance for fuzzy string matching
export function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export function stringSimilarity(s1, s2) {
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Detects predefined conversational intents.
 * Distinguishes pure greetings from substantive questions prefixed with "hi".
 */
export function detectConversationalIntent(rawText, normalizedText) {
  const tokens = normalizedText.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { intent: 'empty' };

  // Check out of scope
  for (const topic of OUT_OF_SCOPE_WORDS) {
    if (normalizedText.includes(topic)) {
      return { intent: 'out_of_scope', confidence: 1.0 };
    }
  }

  // Pure Greeting Check
  if (
    (tokens.length === 1 && GREETING_WORDS.has(tokens[0])) ||
    (tokens.length === 2 && GREETING_WORDS.has(tokens[0]) && ['there', 'sahil', 'bot', 'assistant'].includes(tokens[1])) ||
    normalizedText === 'good morning' ||
    normalizedText === 'good evening' ||
    normalizedText === 'good afternoon'
  ) {
    return { intent: 'greeting', confidence: 1.0 };
  }

  // Thanks
  const THANKS_PHRASES = ['thanks', 'thank you', 'thx', 'appreciate it', 'ty', 'much appreciated', 'thanks a lot'];
  if (THANKS_PHRASES.some((p) => normalizedText === p || normalizedText.startsWith(p + ' '))) {
    return { intent: 'thanks', confidence: 1.0 };
  }

  // Acknowledgement
  const ACK_PHRASES = ['ok', 'okay', 'got it', 'understood', 'alright', 'cool', 'great', 'k', 'sounds good', 'nice', 'okay got it', 'ok got it', 'cool thanks'];
  if (ACK_PHRASES.some((p) => normalizedText === p || normalizedText.startsWith(p + ' '))) {
    return { intent: 'acknowledgement', confidence: 1.0 };
  }

  // Farewell
  const FAREWELL_PHRASES = ['bye', 'goodbye', 'see you', 'cya', 'talk to you later', 'have a good day', 'bye bye'];
  if (FAREWELL_PHRASES.some((p) => normalizedText === p || normalizedText.startsWith(p + ' '))) {
    return { intent: 'farewell', confidence: 1.0 };
  }

  // Help
  const HELP_PHRASES = ['help', 'what can you answer', 'what can i ask', 'what can you do', 'options', 'commands', 'menu'];
  if (HELP_PHRASES.some((p) => normalizedText === p || normalizedText.includes(p))) {
    return { intent: 'help', confidence: 1.0 };
  }

  // Bot Identity
  const IDENTITY_PHRASES = ['who are you', 'what are you', 'are you an ai', 'are you human', 'are you a bot', 'who made you', 'who created you'];
  if (IDENTITY_PHRASES.some((p) => normalizedText.includes(p))) {
    return { intent: 'identity', confidence: 1.0 };
  }

  return null;
}

/**
 * Resolves conversational context for follow-up questions.
 * E.g., if previous message was about "Web Audio Synth" and user asks:
 * "Which technologies did you use in that one?"
 */
export function resolveFollowUpContext(normalizedText, context = {}) {
  const followUpIndicators = ['that one', 'it', 'this one', 'the project', 'in that', 'about it', 'tell me more'];
  const hasFollowUp = followUpIndicators.some((ind) => normalizedText.includes(ind));

  if (hasFollowUp && context.lastKnowledgeEntry) {
    const entry = context.lastKnowledgeEntry;
    if (entry.category === 'Projects' || entry.id.includes('project')) {
      // Append project entity keywords to strengthen matching
      return `${normalizedText} ${entry.canonical_question.toLowerCase()}`;
    }
  }
  return normalizedText;
}

/**
 * Multi-Part question detector:
 * Checks for independent conjunctions e.g. "what projects did you build and what skills do you have"
 */
export function splitMultiPartQuestion(normalizedText) {
  const parts = normalizedText.split(/\band\b|\balso\b/i).map((s) => s.trim()).filter((s) => s.length > 5);
  if (parts.length >= 2) {
    return parts;
  }
  return null;
}

/**
 * Score a candidate knowledge entry against user tokens and normalized query.
 */
export function scoreKnowledgeEntry(entry, queryNorm, queryTokens) {
  let score = 0;
  const matchedDetails = {
    canonicalMatch: false,
    matchedAlias: null,
    matchedKeywords: [],
    entityBoost: 0,
  };

  const canonicalNorm = normalizeText(entry.canonical_question);

  // 1. Exact match on canonical question
  if (queryNorm === canonicalNorm) {
    return { score: 1.0, details: { canonicalMatch: true } };
  }

  // 2. Exact match on any alias
  if (Array.isArray(entry.aliases)) {
    for (const alias of entry.aliases) {
      const aliasNorm = normalizeText(alias);
      if (queryNorm === aliasNorm) {
        return { score: 0.98, details: { matchedAlias: alias } };
      }
      // Substring match
      if (queryNorm.length > 10 && aliasNorm.includes(queryNorm)) {
        score = Math.max(score, 0.90);
        matchedDetails.matchedAlias = alias;
      }
      if (aliasNorm.length > 10 && queryNorm.includes(aliasNorm)) {
        score = Math.max(score, 0.88);
        matchedDetails.matchedAlias = alias;
      }
    }
  }

  // Substring match on canonical
  if (queryNorm.length > 10 && canonicalNorm.includes(queryNorm)) {
    score = Math.max(score, 0.92);
    matchedDetails.canonicalMatch = true;
  }
  if (canonicalNorm.length > 10 && queryNorm.includes(canonicalNorm)) {
    score = Math.max(score, 0.89);
    matchedDetails.canonicalMatch = true;
  }

  // 3. Keyword & Token Overlap Scoring
  if (queryTokens.length > 0) {
    const entryKeywords = new Set((entry.keywords || []).map((k) => k.toLowerCase()));
    const canonicalTokens = extractTokens(canonicalNorm);
    const allEntryWords = new Set([...entryKeywords, ...canonicalTokens]);

    let matchedCount = 0;
    for (const qt of queryTokens) {
      if (allEntryWords.has(qt)) {
        matchedCount++;
        matchedDetails.matchedKeywords.push(qt);
      } else {
        // Fuzzy token match for close typos
        for (const ew of allEntryWords) {
          if (qt.length >= 4 && ew.length >= 4 && stringSimilarity(qt, ew) >= 0.82) {
            matchedCount += 0.85;
            matchedDetails.matchedKeywords.push(`${qt}~${ew}`);
            break;
          }
        }
      }
    }

    const tokenScore = matchedCount / queryTokens.length;
    score = Math.max(score, tokenScore * 0.82);
  }

  // 4. Specific Entity Boosts
  if (Array.isArray(entry.related_entities)) {
    for (const entity of entry.related_entities) {
      const entNorm = normalizeText(entity);
      if (entNorm.length > 3 && queryNorm.includes(entNorm)) {
        matchedDetails.entityBoost += 0.20;
        break;
      }
    }
  }

  const finalScore = Math.min(1.0, score + matchedDetails.entityBoost);
  return { score: Number(finalScore.toFixed(3)), details: matchedDetails };
}

/**
 * Main Answer Selection Engine (Testable, Deterministic, 0 LLM calls)
 */
export function selectAnswer({
  message,
  knowledgeEntries = [],
  templates = {},
  settings = {},
  conversationContext = {},
}) {
  const confidenceThreshold = parseFloat(settings.confidenceThreshold || '0.62');
  const ambiguityThreshold = parseFloat(settings.ambiguityThreshold || '0.38');

  const rawText = (message || '').trim();
  const normalizedText = normalizeText(rawText);

  // 1. Check conversational intents first
  const convIntent = detectConversationalIntent(rawText, normalizedText);
  if (convIntent) {
    const templateKey = convIntent.intent;
    const templateReply = templates[templateKey] || `[${templateKey} response]`;
    return {
      answer: templateReply,
      intent: convIntent.intent,
      confidence: convIntent.confidence || 1.0,
      matchedKnowledgeId: null,
      links: [],
      metadata: { type: 'conversational_intent', intent: convIntent.intent },
    };
  }

  // Strip leading greeting if followed by a substantive question (e.g. "hello what projects...")
  let cleanedText = normalizedText;
  const firstWord = cleanedText.split(/\s+/)[0];
  if (GREETING_WORDS.has(firstWord) && cleanedText.split(/\s+/).length > 2) {
    cleanedText = cleanedText.replace(/^(hi|hello|hey|yo|sup|greetings)\s+/i, '').trim();
  }

  // Handle conversational prompt wrappers such as "ask about my...", "ask how i...", "tell me about..."
  const strippedWrapper = cleanedText.replace(/^(ask(\s+me)?\s+(about|how|why|what|to)|tell\s+me\s+about|can\s+you\s+tell\s+me\s+about|what\s+about)\s+/i, '').trim();
  if (strippedWrapper.length > 2) {
    cleanedText = strippedWrapper;
  }

  // 2. Check for multi-part questions
  const multiParts = splitMultiPartQuestion(cleanedText);
  if (multiParts && multiParts.length === 2) {
    const res1 = selectAnswer({
      message: multiParts[0],
      knowledgeEntries,
      templates,
      settings,
      conversationContext,
    });
    const res2 = selectAnswer({
      message: multiParts[1],
      knowledgeEntries,
      templates,
      settings,
      conversationContext,
    });

    if (res1.confidence >= confidenceThreshold && res2.confidence >= confidenceThreshold) {
      const combinedAnswer = `${res1.answer}\n\n---\n\n${res2.answer}`;
      const combinedLinks = [...(res1.links || []), ...(res2.links || [])];
      return {
        answer: combinedAnswer,
        intent: 'multi_part',
        confidence: Number(((res1.confidence + res2.confidence) / 2).toFixed(3)),
        matchedKnowledgeId: `${res1.matchedKnowledgeId},${res2.matchedKnowledgeId}`,
        links: combinedLinks,
        metadata: {
          type: 'multi_part',
          parts: [res1.matchedKnowledgeId, res2.matchedKnowledgeId],
        },
      };
    }
  }

  // 3. Resolve context for follow-up questions
  const contextAwareQuery = resolveFollowUpContext(cleanedText, conversationContext);
  const queryTokens = extractTokens(contextAwareQuery);

  // 4. Rank knowledge entries
  const activeEntries = knowledgeEntries.filter((e) => e.is_active !== false);
  const scoredCandidates = [];

  for (const entry of activeEntries) {
    const { score, details } = scoreKnowledgeEntry(entry, contextAwareQuery, queryTokens);
    if (score > 0.15) {
      scoredCandidates.push({
        entry,
        score,
        details,
      });
    }
  }

  scoredCandidates.sort((a, b) => b.score - a.score);

  const topMatch = scoredCandidates[0];

  // 5. Decision Gate based on confidence
  if (topMatch && topMatch.score >= confidenceThreshold) {
    return {
      answer: topMatch.entry.answer,
      intent: 'knowledge_match',
      confidence: topMatch.score,
      matchedKnowledgeId: topMatch.entry.id,
      links: topMatch.entry.links || [],
      metadata: {
        canonical_question: topMatch.entry.canonical_question,
        category: topMatch.entry.category,
        score: topMatch.score,
        details: topMatch.details,
      },
    };
  }

  // 6. Ambiguity Gate (Top 2 candidates very close in middle confidence range)
  if (
    topMatch &&
    topMatch.score >= ambiguityThreshold &&
    scoredCandidates.length >= 2 &&
    Math.abs(topMatch.score - scoredCandidates[1].score) < 0.08
  ) {
    const cand1 = topMatch.entry.canonical_question;
    const cand2 = scoredCandidates[1].entry.canonical_question;
    const clarifyTemplate = templates.ambiguous ||
      `Did you mean:\n1. ${cand1}\n2. ${cand2}\n\nPlease ask about either one for detailed information!`;
    return {
      answer: `${clarifyTemplate}\n\n1. "${cand1}"\n2. "${cand2}"`,
      intent: 'ambiguous_clarification',
      confidence: topMatch.score,
      matchedKnowledgeId: null,
      links: [],
      metadata: {
        type: 'ambiguity',
        candidates: [topMatch.entry.id, scoredCandidates[1].entry.id],
      },
    };
  }

  // 7. Closest partial match if above ambiguity threshold
  if (topMatch && topMatch.score >= ambiguityThreshold) {
    return {
      answer: topMatch.entry.answer,
      intent: 'partial_knowledge_match',
      confidence: topMatch.score,
      matchedKnowledgeId: topMatch.entry.id,
      links: topMatch.entry.links || [],
      metadata: {
        canonical_question: topMatch.entry.canonical_question,
        category: topMatch.entry.category,
        score: topMatch.score,
        details: topMatch.details,
        note: 'matched_above_ambiguity_threshold',
      },
    };
  }

  // 8. Low Confidence Fallback
  const fallbackTemplate = templates.fallback ||
    "I'm not sure I have an answer for that yet. Try asking about Sahil's projects, skills, experience, or contact information!";

  return {
    answer: fallbackTemplate,
    intent: 'fallback',
    confidence: topMatch ? topMatch.score : 0.0,
    matchedKnowledgeId: null,
    links: [
      { label: 'View Featured Projects', url: '#/projects' },
      { label: 'View Skills', url: '#section-skills' },
      { label: 'Contact Sahil', url: 'mailto:sahilaw502@gmail.com' },
    ],
    metadata: {
      type: 'fallback',
      reason: topMatch ? 'insufficient_confidence' : 'no_candidates',
      bestCandidateScore: topMatch ? topMatch.score : 0,
      bestCandidateId: topMatch ? topMatch.entry.id : null,
    },
  };
}
