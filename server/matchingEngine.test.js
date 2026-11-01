import assert from 'assert';
import {
  normalizeText,
  detectConversationalIntent,
  selectAnswer,
  stringSimilarity,
} from './matchingEngine.js';
import { INITIAL_KNOWLEDGE_ENTRIES, INITIAL_TEMPLATES, INITIAL_SETTINGS } from './knowledgeSeed.js';

console.log('Running Matching Engine Test Suite (Deterministic, 0 LLM API calls)...');

const templatesMap = {};
for (const t of INITIAL_TEMPLATES) templatesMap[t.key] = t.template;

const settingsMap = {};
for (const s of INITIAL_SETTINGS) settingsMap[s.key] = s.value;

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    passCount++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failCount++;
    console.error(`  [FAIL] ${name}: ${err.message}`);
  }
}

// 1. Text Normalization
test('Text Normalization & Contractions', () => {
  const norm = normalizeText("What's your experiance with React?");
  assert.strictEqual(norm, 'what is your experience with react');
});

// 2. Greeting detection
test('Pure Greeting Detection', () => {
  const res = detectConversationalIntent('Hi', 'hi');
  assert.strictEqual(res.intent, 'greeting');
  assert.strictEqual(res.confidence, 1.0);
});

// 3. Greeting with substantive question is NOT treated as pure greeting
test('Greeting with substantive question is routed to question matcher', () => {
  const res = selectAnswer({
    message: 'Hello, what projects have you built?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'knowledge_match');
  assert.strictEqual(res.matchedKnowledgeId, 'kb-projects-summary');
});

// 4. Thanks detection
test('Thanks Intent Detection', () => {
  const res = selectAnswer({
    message: 'Thank you very much!',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'thanks');
});

// 5. Acknowledgement detection
test('Acknowledgement Intent Detection', () => {
  const res = selectAnswer({
    message: 'Okay got it',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'acknowledgement');
});

// 6. Farewell detection
test('Farewell Intent Detection', () => {
  const res = selectAnswer({
    message: 'Goodbye, see you later!',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'farewell');
});

// 7. Out-of-scope detection
test('Out of Scope detection (movies, weather, etc.)', () => {
  const res = selectAnswer({
    message: 'What is your favourite movie?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'out_of_scope');
});

// 8. Canonical & Alias matching
test('Exact Canonical & Alias Matching (Who are you)', () => {
  const res = selectAnswer({
    message: 'Who is Sahil Ahmed Wani?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.matchedKnowledgeId, 'kb-intro-who-is-sahil');
  assert.ok(res.confidence >= 0.95);
});

// 9. Specific Technology match with typo (React / reack)
test('Technology matching with common typo (React / reack)', () => {
  const res = selectAnswer({
    message: 'Tell me about your reack experiance',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.matchedKnowledgeId, 'kb-skills-react');
  assert.ok(res.confidence >= 0.65);
});

// 10. Specific Project Match (Web Audio Synth)
test('Specific Project Match (Web Audio Synth)', () => {
  const res = selectAnswer({
    message: 'How does your audio synthesizer project work?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.matchedKnowledgeId, 'kb-project-audio-synth');
  assert.ok(res.confidence >= 0.70);
});

// 11. Follow-up Context Resolution
test('Follow-up Context Resolution ("in that one")', () => {
  const synthEntry = INITIAL_KNOWLEDGE_ENTRIES.find((e) => e.id === 'kb-project-audio-synth');
  const res = selectAnswer({
    message: 'Which technologies did you use in that one?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
    conversationContext: { lastKnowledgeEntry: synthEntry },
  });
  assert.strictEqual(res.matchedKnowledgeId, 'kb-project-audio-synth');
  assert.ok(res.confidence >= 0.62);
});

// 12. Contact information
test('Contact information query', () => {
  const res = selectAnswer({
    message: 'How can I contact Sahil for a project?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.matchedKnowledgeId, 'kb-contact-how-to-reach');
  assert.ok(res.answer.includes('sahilaw502@gmail.com'));
});

// 13. Low confidence query triggers fallback
test('Unknown / low-confidence query falls back safely', () => {
  const res = selectAnswer({
    message: 'Can you fly a helicopter in Antarctica?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'fallback');
  assert.ok(res.confidence < 0.38);
});

// 14. Multi-part question splitting and combination
test('Multi-part query combines answers without fabrication', () => {
  const res = selectAnswer({
    message: 'What projects have you built and how can I contact you?',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'multi_part');
  assert.ok(res.answer.includes('Sahil Recreation'));
  assert.ok(res.answer.includes('sahilaw502@gmail.com'));
});

// 15. Secret admin authentication initiation
test('Secret boss prompt triggers admin verification and link', () => {
  const res = selectAnswer({
    message: 'i am sahil your boss',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
  });
  assert.strictEqual(res.intent, 'admin_auth_prompt');
  assert.ok(res.answer.includes('Date of Birth'));
  assert.ok(res.answer.includes('#/chatbot-response'));
});

// 16. Secret admin DOB verification response
test('DOB 2006 response returns admin credentials', () => {
  const res = selectAnswer({
    message: '2006',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    templates: templatesMap,
    settings: settingsMap,
    conversationContext: { lastIntent: 'admin_auth_prompt' },
  });
  assert.strictEqual(res.intent, 'admin_auth_success');
  assert.ok(res.answer.includes('admin'));
  assert.ok(res.answer.includes('sahil@admin'));
});

console.log(`\nTest Results: ${passCount} Passed, ${failCount} Failed.`);
if (failCount > 0) process.exit(1);

