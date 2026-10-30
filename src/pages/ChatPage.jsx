import { useEffect, useRef, useState } from 'react';
import LatticeLoader from '../components/LatticeLoader.jsx';

const prompts = [
  'Ask about my strongest skills',
  'Ask how I build products',
  'Ask about my projects',
  'Ask why a team should hire me',
  'Ask how to contact me',
];

function getThinkingLabel() {
  return 'Answering...';
}

function getLinkIcon(label, url) {
  const l = (label + ' ' + url).toLowerCase();

  if (l.includes('linkedin')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#0a66c2" className="chat-link-icon-brand" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }

  if (l.includes('github')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="chat-link-icon-brand" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  if (l.includes('mail') || l.includes('@')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59a5b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="chat-link-icon-brand" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  if (l.includes('project') || l.includes('synth')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="chat-link-icon-brand" aria-hidden="true">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
    );
  }

  if (l.includes('resume') || l.includes('career') || l.includes('cv')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="chat-link-icon-brand" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }

  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="chat-link-icon-brand" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function assistantReply(question) {
  const q = question.toLowerCase().trim();

  // 1. GitHub specifically
  if (q.includes('github') || q.includes('repo') || q.includes('git ') || q === 'git') {
    return {
      plainText: "You can explore Sahil's open-source projects and code repositories directly on GitHub (https://github.com/sahilaw22).",
      formattedText: "You can explore Sahil's open-source projects and code repositories directly on [GitHub](https://github.com/sahilaw22).",
    };
  }

  // 2. LinkedIn specifically
  if (q.includes('linkedin')) {
    return {
      plainText: "You can view Sahil's professional profile, experience, and recommendations on LinkedIn (https://linkedin.com/in/sahilaw).",
      formattedText: "You can view Sahil's professional profile, experience, and recommendations on [LinkedIn](https://linkedin.com/in/sahilaw).",
    };
  }

  // 3. Contact / Email query
  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('message') || q.includes('mail') || q.includes('freelance') || q.includes('touch')) {
    return {
      plainText: "You can contact Sahil directly via email at sahilwani.work@gmail.com.",
      formattedText: "You can contact Sahil directly via email at [sahilwani.work@gmail.com](mailto:sahilwani.work@gmail.com).",
    };
  }

  // 4. Quick Prompt: "about my strongest skills" / skills / tech stack
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('framework') || q.includes('tool')) {
    return {
      plainText: "Sahil specializes in React, TypeScript, Tailwind CSS, Web Audio API, and GSAP animations, showcased in Projects (#/projects).",
      formattedText: "Sahil specializes in React, TypeScript, Tailwind CSS, Web Audio API, and GSAP animations, showcased in [Projects](#/projects).",
    };
  }

  // 5. Quick Prompt: "how I build products" / build process
  if (q.includes('build') || q.includes('product') || q.includes('process') || q.includes('architecture') || q.includes('workflow')) {
    return {
      plainText: "He builds products by pairing rapid browser prototyping with sound architecture and responsive design, illustrated in Projects (#/projects).",
      formattedText: "He builds products by pairing rapid browser prototyping with sound architecture and responsive design, illustrated in [Projects](#/projects).",
    };
  }

  // 6. Quick Prompt: "about my projects" / projects / portfolio
  if (q.includes('project') || q.includes('portfolio') || q.includes('work') || q.includes('app')) {
    return {
      plainText: "His highlighted work includes a 3D audio-reactive portfolio, a browser synthesizer, and Web3 components in Projects (#/projects).",
      formattedText: "His highlighted work includes a 3D audio-reactive portfolio, a browser synthesizer, and Web3 components in [Projects](#/projects).",
    };
  }

  // 7. Quick Prompt: "why a team should hire me" / why hire / role / job
  if (q.includes('hire') || q.includes('why') || q.includes('team') || q.includes('role') || q.includes('job') || q.includes('join') || q.includes('candidate')) {
    return {
      plainText: "He bridges design intuition with solid engineering to build resilient, user-focused web applications, detailed in his Resume (#/careers).",
      formattedText: "He bridges design intuition with solid engineering to build resilient, user-focused web applications, detailed in his [Resume](#/careers).",
    };
  }

  // 8. Resume / Experience / Background / CV / Education
  if (q.includes('resume') || q.includes('experience') || q.includes('background') || q.includes('cv') || q.includes('education') || q.includes('career')) {
    return {
      plainText: "You can review Sahil's complete career timeline, technical background, and education on his Resume (#/careers).",
      formattedText: "You can review Sahil's complete career timeline, technical background, and education on his [Resume](#/careers).",
    };
  }

  // 9. Who is he / About him
  if (q.includes('who') || q.includes('about')) {
    return {
      plainText: "Sahil is a frontend engineer focused on building performant, visually refined web applications featured in Projects (#/projects).",
      formattedText: "Sahil is a frontend engineer focused on building performant, visually refined web applications featured in [Projects](#/projects).",
    };
  }

  // 10. Greetings: "hi", "hello", "hey", etc.
  if (/^(hi|hello|hey|heyy|yo|sup|greetings|good\s*(morning|afternoon|evening))\b/i.test(q) || q === 'hi' || q === 'hello' || q === 'hey') {
    return {
      plainText: "Hello! I am Sahil's AI assistant, ready to help you explore his work and background in Projects (#/projects).",
      formattedText: "Hello! I am Sahil's AI assistant, ready to help you explore his work and background in [Projects](#/projects).",
    };
  }

  // 11. Affirmations: "yes", "sure", "show me", etc.
  if (/^(yes|yeah|yep|yup|sure|definitely|absolutely|show me|tell me|go ahead|please do)\b/i.test(q) || q === 'yes' || q === 'sure' || q === 'yeah') {
    return {
      plainText: "You can view all his interactive builds and web applications in Projects (#/projects).",
      formattedText: "You can view all his interactive builds and web applications in [Projects](#/projects).",
    };
  }

  // 12. Acknowledgments: "ok", "thanks", "great", etc.
  if (/^(ok|okay|got it|cool|nice|great|awesome|perfect|sounds good|thanks|thank you|thx)\b/i.test(q) || q === 'ok' || q === 'okay' || q === 'thanks') {
    return {
      plainText: "Glad to help! You can reach Sahil directly via email at sahilwani.work@gmail.com.",
      formattedText: "Glad to help! You can reach Sahil directly via email at [sahilwani.work@gmail.com](mailto:sahilwani.work@gmail.com).",
    };
  }

  // 13. Negatives: "no", "nope", "not now"
  if (/^(no|nope|nah|not now|never mind|nothing)\b/i.test(q) || q === 'no' || q === 'nope') {
    return {
      plainText: "Understood. I am here whenever you want to explore Sahil's work or check his Projects (#/projects).",
      formattedText: "Understood. I am here whenever you want to explore Sahil's work or check his [Projects](#/projects).",
    };
  }

  // 14. Professional Fallback for unhandled / off-topic queries
  return {
    plainText: "I am here specifically to provide information about Sahil, including his technical skills, background, and featured Projects (#/projects). Please feel free to ask about his work, experience, or contact details.",
    formattedText: "I am here specifically to provide information about Sahil, including his technical skills, background, and featured [Projects](#/projects). Please feel free to ask about his work, experience, or contact details.",
  };
}

function renderFormattedChatText(text) {
  if (!text) return null;

  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const url = match[2];
    const isExternal = url.startsWith('http') || url.startsWith('mailto');

    parts.push(
      <a
        key={`${url}-${match.index}`}
        href={url}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noreferrer noopener' : undefined}
        className="chat-inline-link"
      >
        <span className="chat-link-icon-wrap" aria-hidden="true">
          {getLinkIcon(label, url)}
        </span>
        <strong>{label}</strong>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chat-link-arrow"
          aria-hidden="true"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </a>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const messagesRef = useRef(null);
  const typingTimersRef = useRef(new Set());

  useEffect(() => {
    if (isComposerFocused) return undefined;

    const target = prompts[promptIndex];
    let delay = isDeletingPlaceholder ? 28 : 52;

    if (!isDeletingPlaceholder && placeholderText === target) {
      delay = 1500;
    }

    const typingTimer = window.setTimeout(() => {
      if (!isDeletingPlaceholder && placeholderText === target) {
        setIsDeletingPlaceholder(true);
      } else if (isDeletingPlaceholder && placeholderText === '') {
        setIsDeletingPlaceholder(false);
        setPromptIndex((current) => (current + 1) % prompts.length);
      } else if (isDeletingPlaceholder) {
        setPlaceholderText((current) => current.slice(0, -1));
      } else {
        setPlaceholderText(target.slice(0, placeholderText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(typingTimer);
  }, [isComposerFocused, isDeletingPlaceholder, placeholderText, promptIndex]);

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (messagesElement) {
      messagesElement.scrollTo({ top: messagesElement.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => () => {
    typingTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function submitQuestion(questionText) {
    const question = questionText?.trim();
    if (!question) return;

    if (typeof document !== 'undefined' && document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    setIsComposerFocused(false);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    const replyData = assistantReply(question);
    const thinkingLabel = getThinkingLabel(question);
    const messageId = `${Date.now()}-${Math.random()}`;
    const replyId = `${messageId}-reply`;

    setDraft('');
    setMessages((current) => [
      ...current,
      { id: messageId, role: 'user', text: question },
      {
        id: replyId,
        role: 'manager',
        text: '',
        formattedText: replyData.formattedText,
        isDone: false,
        label: thinkingLabel,
      },
    ]);

    const reply = replyData.plainText;
    const thinkDelay = 400;
    const startTimer = window.setTimeout(() => {
      let charIdx = 0;

      function typeReply() {
        charIdx += 2;
        const currentText = reply.slice(0, charIdx);
        const isFinished = charIdx >= reply.length;

        setMessages((current) => current.map((msg) => {
          if (msg.id !== replyId) return msg;
          return {
            ...msg,
            text: currentText,
            isDone: isFinished,
          };
        }));

        if (!isFinished) {
          const timer = window.setTimeout(typeReply, 15);
          typingTimersRef.current.add(timer);
        }
      }

      typeReply();
    }, thinkDelay);

    typingTimersRef.current.add(startTimer);
  }

  function sendMessage(event) {
    event.preventDefault();
    submitQuestion(draft);
  }

  return (
    <main className="chat-page">
      <section className={`chat-shell${messages.length ? '' : ' is-empty'}`} aria-label="Manager chat">
        <header className={`chat-header${messages.length ? ' has-messages' : ''}`}>
          <h1>What do you want to know?</h1>
          <p className="chat-subtitle">Ask about my work, projects, skills, or experience.</p>
        </header>

        <div className="chat-messages" ref={messagesRef}>
          {messages.map((message) => (
            <div className={`chat-message ${message.role}`} key={message.id}>
              {message.role === 'user' && (
                <p>{message.text}</p>
              )}

              {message.role === 'manager' && (
                <>
                  <div style={{ marginBottom: message.text ? '0.65rem' : '0' }}>
                    <LatticeLoader
                      status={message.isDone ? 'done' : 'working'}
                      label={message.label || 'Answering...'}
                      doneLabel="Answered"
                      pattern="orbit"
                      grid={3}
                      shape="round"
                      doneColor="rgba(255, 255, 255, 0.75)"
                      errorColor="rgba(255, 255, 255, 0.75)"
                      cellSize={3.5}
                      gap={1.5}
                      fontSize={13}
                      step={90}
                      idleOpacity={0.15}
                      glow={false}
                      glowColor=""
                      showTimer={false}
                    />
                  </div>

                  {message.text ? (
                    <p className="chat-manager-text">
                      {message.isDone
                        ? renderFormattedChatText(message.formattedText || message.text)
                        : message.text}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="chat-bottom-dock">
          <form className="chat-composer" onSubmit={sendMessage}>
            {!draft && !isComposerFocused && (
              <span className="chat-placeholder-text">
                {placeholderText}
                <i aria-hidden="true" />
              </span>
            )}
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onFocus={() => setIsComposerFocused(true)}
              onBlur={() => setIsComposerFocused(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(event);
                }
              }}
              placeholder=""
              aria-label="Ask a question"
              rows="1"
            />
            <button type="submit" aria-label="Send question" disabled={!draft.trim()}>
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M10.774 23.619l-1.625 5.691C9.06 29.164 9 28.992 9 28.794v-5.57l13.09-12.793L10.774 23.619zM10.017 29.786c.243-.002.489-.084.69-.285l3.638-3.639-2.772-1.386-1.556 5.31zM28.835 2.009L3.802 14.326c-2.226 1.095-2.236 4.266-.017 5.375l4.89 2.445L27.464 3.79c.204-.199.516-.234.759-.086.326.2.396.644.147.935l-16.3 18.976 8.84 4.4c1.746.873 3.848-.128 4.27-2.034l5.071-22.858c.184-.819-.663-1.484-1.416-1.114z" fill="currentColor" />
              </svg>
            </button>
          </form>

          <div className="chat-quick-strip" aria-label="Quick questions">
            <div className="chat-quick-track">
              {[...prompts, ...prompts, ...prompts, ...prompts].map((prompt, index) => (
                <button
                  type="button"
                  key={`${prompt}-${index}`}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    submitQuestion(prompt.replace(/^Ask /, ''));
                  }}
                >
                  {prompt.replace(/^Ask /, '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
