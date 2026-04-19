import { useState } from "react";

const categories = [
  {
    name: "Project Overview & STAR Story",
    icon: "◆",
    color: "#E8A87C",
    cards: [
      {
        q: "What is the AI Ad Planner?",
        a: `An AI-native product at Matchcraft that automates digital ad campaign generation for SMB advertisers. It takes a business URL as input and produces a fully structured ad campaign — keywords, ad copy, budget allocation — using LLM-powered multi-step pipeline.

Previously, account managers spent 30–60 minutes manually configuring each campaign. Quality varied wildly across AMs. The AI Ad Planner standardized and accelerated this to minutes.`,
      },
      {
        q: "What problem does it solve?",
        a: `Matchcraft serves thousands of SMB advertisers through reseller partners. The core bottleneck was manual campaign creation:

• Slow: 30–60 min per campaign
• Inconsistent: Quality depended on individual AM expertise
• Unscalable: Adding more advertisers meant adding more AMs

The AI Ad Planner eliminated this bottleneck by automating the entire workflow from URL → live campaign structure.`,
      },
      {
        q: "What was your role?",
        a: `Software Engineering Team Lead. Owned the full technical direction:

• Designed the end-to-end architecture
• Led the engineering team through prototype → production
• Made all key technology and design decisions
• Hands-on with backend (Spring Boot), LLM integration (OpenAI APIs), and frontend (Vue/Vite/Tailwind)
• Drove prompt engineering, error handling, and cost optimization`,
      },
      {
        q: "What was the impact / result?",
        a: `• Campaign creation time dropped from 30–60 min to minutes
• Quality became consistent across all account managers
• Reseller partners could onboard SMBs significantly faster
• Became a key product differentiator for Matchcraft
• Enabled scale without linear headcount growth`,
      },
    ],
  },
  {
    name: "Architecture & Tech Stack",
    icon: "⬡",
    color: "#85CDCA",
    cards: [
      {
        q: "Why Spring Boot for an AI product (not Python)?",
        a: `The entire Matchcraft platform is Java/Spring Boot. Building in Python would mean:

• A separate deployment pipeline
• A separate team skill set to maintain
• Separate monitoring and observability
• A new operational surface to manage

LLM calls are just HTTP requests — they're language-agnostic. Keeping it in Java meant faster path to production, shared infrastructure, and the team could own it without a skills gap.

Key insight: The AI part is the API call. Everything around it — orchestration, retry, persistence, auth — benefits from the existing mature ecosystem.`,
      },
      {
        q: "Why Vue over React?",
        a: `Matchcraft already had Vue adoption in the platform. Introducing React would mean:

• Two frontend frameworks to maintain
• Split team expertise
• Duplicate tooling (build configs, linting, testing)

Vue 3's Composition API provides React-like patterns (hooks, reactive state) without the ecosystem split. For a new product surface bolted onto an existing platform, consistency > trendiness.`,
      },
      {
        q: "Why PostgreSQL JSONB for LLM outputs?",
        a: `LLM outputs evolve constantly as you iterate on prompts. Rigid relational columns would mean:

• Constant schema migrations on every prompt change
• Friction in experimentation
• Mismatch between flexible AI output and rigid storage

JSONB gives you:
• Store the full LLM response as-is
• Query into it with SQL (e.g., response->'keywords'->0)
• Add structure gradually as patterns stabilize
• No migration needed when prompt output format changes

Best of both worlds — flexibility of NoSQL, queryability of SQL.`,
      },
      {
        q: "Why multi-step pipeline vs one big prompt?",
        a: `A monolithic prompt has several problems:

1. Unreliable output: One big prompt produces inconsistent structure. Miss one field and the entire response is unusable.
2. No debuggability: If output is wrong, you can't tell which "part" of the reasoning failed.
3. No partial recovery: If it fails, you lose everything.

Multi-step pipeline (URL scraping → business understanding → keyword gen → ad copy → budget allocation):

• Validate each step independently
• Retry individual steps on failure
• Tune prompts per step without side effects
• Cache intermediate results
• Observe where quality drops

Think of it like microservices vs monolith — same reasoning applies to prompt design.`,
      },
      {
        q: "Why not fine-tune a model?",
        a: `Cost-benefit analysis didn't justify it for v1:

Fine-tuning requires:
• Curated training dataset (thousands of examples)
• Evaluation framework to measure quality
• Training pipeline and infrastructure
• Ongoing model management and versioning
• Retraining as requirements change

Prompt engineering with GPT-4 got 90%+ quality for our use case. The marginal quality gain from fine-tuning didn't justify the operational overhead.

When to revisit: If prompt costs become prohibitive at scale, or quality plateaus on edge cases that prompt engineering can't solve.`,
      },
    ],
  },
  {
    name: "Rate Limiting",
    icon: "⏱",
    color: "#D4A5A5",
    cards: [
      {
        q: "How did you implement tenant-level rate limiting?",
        a: `Sliding window algorithm using an in-memory ConcurrentHashMap (single instance) or Redis sorted set (distributed).

Each tenant gets a deque of request timestamps. On each request:
1. Evict entries older than the window (e.g., 1 hour)
2. Check count against max (e.g., 100/hour)
3. If under limit → add timestamp, allow request
4. If at limit → return 429 with Retry-After header

Implemented as a Spring HandlerInterceptor so it runs before any controller logic.`,
      },
      {
        q: "What is the sliding window approach?",
        a: `Two common approaches:

Fixed window: Count resets at boundaries (e.g., every hour at :00). Problem — a tenant can fire 100 requests at 2:59 and 100 more at 3:00. Effectively 200 in 1 minute.

Sliding window: Window moves with each request. "100 per hour" means 100 in any 60-minute span. No burst-at-boundary exploit.

Implementation: Redis sorted set with timestamp as score. On each request, ZREMRANGEBYSCORE evicts old entries, ZCARD counts remaining, ZADD inserts current.`,
      },
      {
        q: "Why sorted set over INCR + EXPIRE?",
        a: `INCR + EXPIRE gives you a fixed window — the counter resets when the key expires. This creates the boundary burst problem.

Sorted set with timestamp-as-score gives a true sliding window:
• ZREMRANGEBYSCORE key 0 (now - window) → evict old
• ZCARD key → count current
• ZADD key now requestId → add new

Each entry's score is its timestamp, so you can precisely remove "older than 1 hour ago" at any moment. No artificial boundaries.

Trade-off: Slightly more memory per key (stores all timestamps vs. a single counter). Worth it for accuracy.`,
      },
      {
        q: "How does it scale to multi-instance (Redis)?",
        a: `In-memory ConcurrentHashMap works for a single JVM. With multiple app instances behind a load balancer, each instance has its own count — a tenant could get N × limit by hitting different instances.

Solution: Move the state to Redis.
• Sorted set per tenant for sliding window
• All instances read/write the same Redis key
• Redis is single-threaded — operations are atomic
• Add TTL on the key so it self-cleans

Code change is minimal — swap ConcurrentHashMap calls for RedisTemplate.opsForZSet() calls. Same algorithm, shared state.`,
      },
      {
        q: "What is Redisson and why use it over Jedis/Lettuce?",
        a: `Redisson is a Java Redis client that provides distributed versions of java.util.concurrent structures — locks, semaphores, maps, queues, rate limiters.

Jedis/Lettuce are low-level: you write raw Redis commands, Lua scripts, and handle distributed coordination yourself.

Redisson gives you the same API you already know:
• RSemaphore → works like java.util.concurrent.Semaphore
• RLock → works like ReentrantLock
• RMapCache → ConcurrentMap with per-entry TTL
• RRateLimiter → built-in distributed token bucket

Less custom code, fewer bugs in coordination logic. The team uses familiar java.util.concurrent patterns — Redisson makes them distributed transparently.`,
      },
      {
        q: "What is RRateLimiter?",
        a: `Redisson's built-in distributed rate limiter. Token bucket algorithm, fully managed.

RRateLimiter limiter = redisson.getRateLimiter("tenant:" + tenantId);
limiter.trySetRate(RateType.OVERALL, 100, 1, RateIntervalUnit.HOURS);

if (limiter.tryAcquire(1, 5, TimeUnit.SECONDS)) {
    // proceed
} else {
    // 429
}

This replaces the entire sorted set approach — fewer moving parts, battle-tested implementation. Handles multi-instance coordination automatically via Redis.

Use it when you want a clean, production-ready rate limiter without writing your own sliding window logic.`,
      },
    ],
  },
  {
    name: "Fault Tolerance",
    icon: "🛡",
    color: "#95B8D1",
    cards: [
      {
        q: "How did you handle LLM failures?",
        a: `Three patterns stacked together:

1. Retry with exponential backoff — transient failures self-heal
2. Circuit breaker — stop calling a dead service, fail fast
3. Graceful degradation — save partial results, never lose completed work

Each pattern handles a different failure mode:
• Retry → intermittent 5xx, timeouts
• Circuit breaker → sustained outage
• Graceful degradation → partial pipeline failure

Together they ensure: best-effort completion, no wasted spend on doomed calls, and users always see something useful.`,
      },
      {
        q: "Explain retry with exponential backoff",
        a: `Each LLM call retries up to 3 times: 1s → 2s → 4s delay between attempts.

Why exponential? Gives the upstream service time to recover. Linear retry (1s, 1s, 1s) hammers a struggling service. Exponential backs off progressively.

Key rules:
• Only retry on transient errors (5xx, timeouts)
• Never retry on 4xx (bad input won't magically fix itself)
• Add jitter (random 0–500ms) to prevent thundering herd — many instances retrying at the exact same second
• Cap max delay to prevent infinite waits

Implementation: Resilience4j @Retry annotation or RetryTemplate in Spring.`,
      },
      {
        q: "Explain circuit breaker pattern (Resilience4j)",
        a: `Three states:

CLOSED (normal): Requests flow through. Track failure rate.
OPEN (tripped): If failures exceed threshold (e.g., 50% in 5-min window), stop calling. Return fallback immediately. No wasted requests.
HALF-OPEN (probing): After cooldown (e.g., 30s), send one probe request. If it succeeds → CLOSED. If it fails → OPEN again.

Why? Without a circuit breaker, during an OpenAI outage you'd:
• Queue up hundreds of doomed requests
• Waste money on calls that will timeout
• Increase latency for users waiting on inevitable failures

With circuit breaker: fail fast, surface "service temporarily unavailable", retry automatically when the service recovers.

Resilience4j integrates cleanly with Spring Boot via annotations:
@CircuitBreaker(name = "openai", fallbackMethod = "fallback")`,
      },
      {
        q: "What is graceful degradation in your pipeline?",
        a: `The pipeline has 5 steps: URL scrape → business understanding → keywords → ad copy → budget.

If step 3 (keywords) succeeds but step 4 (ad copy) fails:
• Persist steps 1–3 results
• Mark step 4 as "pending"
• Show user: "Keywords generated. Ad copy pending — retry or edit manually."

Key principle: Never lose completed work because a later step failed.

Implementation:
• Each step writes its result to the DB independently
• Pipeline status tracks per-step completion
• UI renders whatever is available + retry buttons for failed steps
• User can manually fill in failed steps and continue`,
      },
      {
        q: "Why not use a message queue for v1?",
        a: `Adding Kafka or RabbitMQ for v1 would mean:

• New infrastructure to deploy, monitor, and maintain
• Message serialization/deserialization complexity
• Dead letter queues, consumer groups, offset management
• Team needs to learn a new operational surface

For v1, request volume was manageable with synchronous calls + retry. The pipeline is user-initiated (not batch processing), so the user is already waiting for a response — async wouldn't improve their experience.

When to add a queue:
• Thousands of concurrent generations
• Batch processing (generate campaigns for 500 businesses overnight)
• Need to decouple producers from consumers for independent scaling

Staff-level answer: "Premature infrastructure adds complexity without proportional value. We'd add it when the scaling need is real, not speculative."`,
      },
    ],
  },
  {
    name: "Cost Control",
    icon: "$",
    color: "#C9CBA3",
    cards: [
      {
        q: "What were your three levers for cost control?",
        a: `1. Caching — Don't re-call for the same input. If someone generates a campaign for "joes-pizza.com" and another AM does the same URL within a time window, serve cached results.

2. Prompt optimization — Shorter prompts = fewer input tokens. Remove verbose instructions, use structured output formats, leverage few-shot examples efficiently. Every token costs money.

3. Rate limiting per tenant — Prevent any single tenant from running away with usage. Hard cap per hour + alerting when tenants approach limits.

Together: Cache avoids redundant spend, prompt optimization reduces per-call cost, rate limiting caps total exposure.`,
      },
      {
        q: "How did you cache LLM responses?",
        a: `Application-level cache keyed on normalized input:

Key: hash(normalized_url + prompt_version)
Value: LLM response
TTL: 24 hours (business info doesn't change hourly)

Why prompt_version in the key? When you update a prompt, cached responses from the old prompt are stale. Including the version auto-invalidates on prompt changes.

Why normalize the URL? "https://joes-pizza.com", "joes-pizza.com", "JOES-PIZZA.COM" should all hit the same cache entry.

Storage: Redis (RMapCache via Redisson) for distributed cache across instances. Per-entry TTL so stale entries self-evict.`,
      },
      {
        q: "How did you optimize prompts for token reduction?",
        a: `Several techniques:

1. System prompt compression — Rewrite verbose instructions into concise bullet points. "Please generate a list of relevant keywords for this business" → "Generate keywords for:"

2. Structured output format — Request JSON output instead of prose. Fewer output tokens, easier to parse.

3. Few-shot pruning — Start with many examples, measure quality, remove examples until quality drops. Find the minimum examples needed.

4. Context window management — Only send relevant scraped content, not the entire webpage. Extract key sections (business name, services, location) before sending to LLM.

5. Model tiering — Use GPT-4 for complex steps (business understanding), GPT-3.5 for simpler steps (formatting, basic extraction). 3.5 is ~20x cheaper.`,
      },
    ],
  },
  {
    name: "Leadership & Ambiguity",
    icon: "★",
    color: "#B8B8D1",
    cards: [
      {
        q: "How did you prototype fast but ship production-quality?",
        a: `Concentric circles approach:

Ring 1 (Week 1–2): Get the core loop working. URL in → campaign out. Happy path only. No error handling, no caching, no rate limiting. Prove the concept works.

Ring 2 (Week 3–4): Add error handling, retry logic, and basic validation. Now it's reliable for a demo.

Ring 3 (Week 5–8): Production hardening — circuit breakers, rate limiting, cost controls, monitoring, logging. Now it's shippable.

Key principle: Each ring is a deployable increment. Stakeholders see progress at every stage. You're never "80% done with nothing to show."

This maps directly to what fast-moving AI teams need — validate the idea before investing in production infrastructure.`,
      },
      {
        q: "How did you lead the team through ambiguity?",
        a: `No playbook existed for this product. Three things I did:

1. Defined the technical roadmap as a sequence of bets, not a waterfall plan. "We'll try X. If it works, we continue. If not, we pivot to Y." This gave the team permission to experiment without fear of "wasting time."

2. Broke work into shippable increments. Nobody worked on something for 3 weeks without visible output. Short feedback loops kept morale high and direction clear.

3. Shielded the team from stakeholder churn. Product and business had evolving ideas. I absorbed that ambiguity, translated it into stable 2-week goals, and only redirected the team when the change was material.

Result: The team shipped confidently in an uncertain environment because they had clarity at the task level even when the big picture was evolving.`,
      },
      {
        q: "How do you think about building AI responsibly?",
        a: `Three concrete practices from the AI Ad Planner:

1. Human-in-the-loop: No campaign goes live without human review. The AI generates, a human approves. This catches hallucinations, inappropriate content, and edge cases the model doesn't understand.

2. Output validation: Structured validation on every LLM response — are required fields present? Are keyword counts within bounds? Is the budget allocation sane? Reject and retry if not.

3. Transparency: Users see what the AI generated and can edit every field. It's a tool, not a black box. Users maintain agency over the final output.

Responsible AI isn't just about bias detection — it's about designing systems where humans stay in control and AI failures are recoverable.`,
      },
    ],
  },
];

export default function InterviewGuide() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  const currentCategory = categories[activeCategory];
  const currentCard = currentCategory.cards[activeCard];

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', 'Menlo', monospace",
        background: "#1a1a2e",
        color: "#e0e0e0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cat-pill {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1.5px solid #2a2a4a;
          background: #16213e;
          cursor: pointer;
          font-size: 12px;
          font-family: 'IBM Plex Mono', monospace;
          color: #8888aa;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        .cat-pill:hover { border-color: #4a4a7a; color: #c0c0d0; }
        .cat-pill.active {
          background: #1a1a3e;
          color: #fff;
          border-color: var(--accent);
          box-shadow: 0 0 12px var(--accent-glow);
        }

        .q-card {
          padding: 14px 16px;
          border-radius: 8px;
          border: 1.5px solid #2a2a4a;
          background: #16213e;
          cursor: pointer;
          font-size: 13px;
          font-family: 'IBM Plex Mono', monospace;
          color: #9999bb;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .q-card:hover { border-color: #4a4a7a; color: #d0d0e0; transform: translateX(3px); }
        .q-card.active {
          background: #1a1a3e;
          color: #fff;
          border-color: var(--accent);
          box-shadow: 0 0 16px var(--accent-glow);
        }
        .q-card .idx {
          font-size: 10px;
          font-weight: 700;
          color: var(--accent);
          opacity: 0.7;
          min-width: 20px;
          padding-top: 2px;
        }
        .q-card.active .idx { opacity: 1; }

        .answer-panel {
          background: #16213e;
          border: 1.5px solid #2a2a4a;
          border-radius: 10px;
          padding: 28px;
          white-space: pre-wrap;
          line-height: 1.75;
          font-size: 13.5px;
          color: #c8c8e0;
          flex: 1;
          overflow-y: auto;
          font-family: 'IBM Plex Mono', monospace;
        }
        .answer-panel strong, .answer-panel b {
          color: #fff;
          font-weight: 600;
        }

        .header-bar {
          padding: 20px 28px 16px;
          border-bottom: 1px solid #2a2a4a;
        }

        .scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #3a3a5a; border-radius: 10px; }
      `}</style>

      {/* Header */}
      <div className="header-bar">
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 4,
            letterSpacing: "-0.5px",
          }}
        >
          AI Ad Planner — Interview Deep Dive
        </div>
        <div style={{ fontSize: 11, color: "#666688", letterSpacing: "0.5px" }}>
          {categories.reduce((sum, c) => sum + c.cards.length, 0)} QUESTIONS
          ACROSS {categories.length} CATEGORIES
        </div>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "14px 28px",
          overflowX: "auto",
          borderBottom: "1px solid #2a2a4a",
        }}
      >
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`cat-pill ${i === activeCategory ? "active" : ""}`}
            style={{
              "--accent": cat.color,
              "--accent-glow": cat.color + "33",
            }}
            onClick={() => {
              setActiveCategory(i);
              setActiveCard(0);
            }}
          >
            <span style={{ marginRight: 6 }}>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Content: Two Columns */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          "--accent": currentCategory.color,
          "--accent-glow": currentCategory.color + "33",
        }}
      >
        {/* Left: Question Cards */}
        <div
          className="scrollbar-thin"
          style={{
            width: 340,
            minWidth: 280,
            padding: "16px 12px 16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflowY: "auto",
            borderRight: "1px solid #2a2a4a",
          }}
        >
          {currentCategory.cards.map((card, i) => (
            <button
              key={i}
              className={`q-card ${i === activeCard ? "active" : ""}`}
              style={{
                "--accent": currentCategory.color,
                "--accent-glow": currentCategory.color + "33",
              }}
              onClick={() => setActiveCard(i)}
            >
              <span className="idx">
                {String(i + 1).padStart(2, "0")}
              </span>
              {card.q}
            </button>
          ))}
        </div>

        {/* Right: Answer Panel */}
        <div
          style={{ flex: 1, padding: "16px 20px 16px 16px", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              fontSize: 11,
              color: currentCategory.color,
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {currentCategory.icon} {currentCategory.name}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 16,
              fontFamily: "'Space Mono', monospace",
              lineHeight: 1.4,
            }}
          >
            {currentCard.q}
          </div>
          <div className="answer-panel scrollbar-thin">{currentCard.a}</div>
        </div>
      </div>

      {/* Footer Nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 28px",
          borderTop: "1px solid #2a2a4a",
          fontSize: 12,
        }}
      >
        <button
          className="cat-pill"
          style={{
            opacity: activeCard === 0 && activeCategory === 0 ? 0.3 : 1,
            "--accent": currentCategory.color,
            "--accent-glow": currentCategory.color + "33",
          }}
          onClick={() => {
            if (activeCard > 0) {
              setActiveCard(activeCard - 1);
            } else if (activeCategory > 0) {
              const prevCat = activeCategory - 1;
              setActiveCategory(prevCat);
              setActiveCard(categories[prevCat].cards.length - 1);
            }
          }}
        >
          ← Prev
        </button>
        <span style={{ color: "#5555777" }}>
          {activeCard + 1} / {currentCategory.cards.length}
        </span>
        <button
          className="cat-pill"
          style={{
            opacity:
              activeCard === currentCategory.cards.length - 1 &&
              activeCategory === categories.length - 1
                ? 0.3
                : 1,
            "--accent": currentCategory.color,
            "--accent-glow": currentCategory.color + "33",
          }}
          onClick={() => {
            if (activeCard < currentCategory.cards.length - 1) {
              setActiveCard(activeCard + 1);
            } else if (activeCategory < categories.length - 1) {
              setActiveCategory(activeCategory + 1);
              setActiveCard(0);
            }
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
