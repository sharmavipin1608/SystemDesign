# SYSTEM DESIGN GUIDE - MULTI-FILE ARCHITECTURE PLAN

## PROBLEM STATEMENT
Single 500KB+ HTML file would:
- ❌ Be slow to load
- ❌ Hard to edit individual sections
- ❌ Token limits when updating
- ❌ Poor SEO (no internal linking)
- ❌ Difficult to maintain metrics across files

## SOLUTION: MODULAR MULTI-FILE ARCHITECTURE

---

## FILE STRUCTURE OVERVIEW

```
system-design-guide/
│
├── index.html                          # LANDING PAGE
│   └─ Navigation hub, quick links
│
├── shared/
│   ├── base.css                        # SHARED STYLES
│   │   ├─ Color scheme, typography
│   │   ├─ Button styles, layout
│   │   └─ Responsive breakpoints
│   │
│   ├── metrics-reference.js            # METRICS DATA (JSON)
│   │   ├─ Redis benchmarks
│   │   ├─ PostgreSQL specs
│   │   ├─ DynamoDB costs
│   │   ├─ All tools' numbers
│   │   └─ Easily updatable, reusable
│   │
│   ├── navigation.js                   # SHARED NAV LOGIC
│   │   ├─ Breadcrumb generation
│   │   ├─ Step counter
│   │   └─ Back/forward logic
│   │
│   └── components.js                   # REUSABLE UI COMPONENTS
│       ├─ MetricsTable()
│       ├─ ProsCons()
│       ├─ ScalingLimits()
│       ├─ WhenNotToUse()
│       ├─ CodeExample()
│       └─ CaveatsBox()
│
├── phase-1-foundational/               # PHASE 1: FOUNDATIONS
│   ├── index.html                      # Phase 1 hub
│   ├── scalability-basics.html
│   ├── consistency-models.html
│   ├── availability-reliability.html
│   └── building-blocks.html
│
├── phase-2-data-layer/                 # PHASE 2: DATA LAYER
│   ├── index.html                      # Phase 2 hub
│   ├── choosing-database-tree.html     # Decision tree
│   ├── replication-strategies.html     # Deep dive
│   ├── sharding-strategies.html        # Deep dive
│   ├── combining-repl-shard.html
│   ├── data-consistency.html
│   └── indexing-optimization.html
│
├── phase-3-caching/                    # PHASE 3: CACHING
│   ├── index.html
│   ├── caching-fundamentals.html
│   ├── cache-layers.html
│   ├── caching-policies.html
│   ├── distributed-cache-challenges.html
│   ├── cache-technologies.html
│   └── cache-key-design.html
│
├── phase-4-search-analytics/           # PHASE 4: SEARCH & ANALYTICS
│   ├── index.html
│   ├── full-text-search.html
│   ├── timeseries-data.html
│   ├── graph-databases.html
│   └── data-warehousing.html
│
├── phase-5-messaging/                  # PHASE 5: MESSAGE QUEUES
│   ├── index.html
│   ├── queues-vs-streaming.html
│   ├── message-queue-systems.html
│   ├── event-streaming.html
│   ├── streaming-patterns.html
│   ├── backpressure-flow-control.html
│   └── dlq-reprocessing.html
│
├── phase-6-api-design/                 # PHASE 6: API DESIGN
│   ├── index.html
│   ├── api-paradigms.html
│   ├── rate-limiting.html
│   ├── idempotency.html
│   ├── pagination.html
│   └── versioning.html
│
├── phase-7-infrastructure/             # PHASE 7: INFRASTRUCTURE
│   ├── index.html
│   ├── load-balancing.html
│   ├── api-gateway.html
│   ├── service-mesh.html
│   ├── containerization.html
│   ├── multi-region-dr.html
│   └── deployment-strategies.html
│
├── phase-8-security/                   # PHASE 8: SECURITY
│   ├── index.html
│   ├── authentication-authorization.html
│   ├── data-security.html
│   ├── data-privacy.html
│   ├── payment-security.html
│   ├── network-security.html
│   └── audit-logging.html
│
├── phase-9-observability/              # PHASE 9: OBSERVABILITY
│   ├── index.html
│   ├── metrics.html
│   ├── logging.html
│   ├── distributed-tracing.html
│   ├── profiling-debugging.html
│   ├── slos-slis.html
│   └── dashboards.html
│
├── phase-10-resilience/                # PHASE 10: RESILIENCE
│   ├── index.html
│   ├── failure-modes.html
│   ├── resilience-patterns.html
│   ├── chaos-engineering.html
│   └── backup-dr.html
│
├── phase-11-patterns-cases/            # PHASE 11: PATTERNS & CASES
│   ├── index.html
│   ├── architectural-patterns.html
│   ├── data-patterns.html
│   ├── case-studies/
│   │   ├── twitter.html
│   │   ├── instagram.html
│   │   ├── uber.html
│   │   ├── dropbox.html
│   │   ├── netflix.html
│   │   └── [12 more...]
│   └── interview-prep.html
│
├── quick-reference/                    # QUICK REFERENCE (BONUS)
│   ├── metrics-cheat-sheet.html        # All numbers in one place
│   ├── decision-tree-flowchart.html    # Visual flow
│   ├── technology-comparison.html      # Matrix: Redis vs Memcached vs...
│   └── common-mistakes.html
│
└── sitemap.html                        # Full navigation & index
```

---

## DETAILED FILE DESCRIPTIONS & DEPENDENCIES

### **Tier 0: Shared Infrastructure** (build first)
```
shared/
├── base.css             ← Everything depends on this
├── metrics-reference.js ← Data layer (reusable JSON)
├── navigation.js        ← All pages use this
└── components.js        ← Shared UI building blocks
```

**metrics-reference.js structure:**
```javascript
// Data organized by technology
const METRICS = {
  redis: {
    throughput: {
      singleNode: "500K-1M RPS",
      cluster_6nodes: "3-5M RPS"
    },
    latency: {
      p50: "<0.5ms",
      p99: "<1ms"
    },
    limits: {
      maxConnections: "10,000-65,000",
      networkBandwidth: "~1 Gbps"
    },
    cost: "$0.25/GB/month"
  },
  postgresql: { ... },
  dynamodb: { ... },
  // ... 20+ technologies
}

// Lookup function for any page
function getMetric(tech, category) {
  return METRICS[tech]?.[category]
}
```

---

### **Tier 1: Hub Pages** (one per phase)
Each phase has an **index.html** that:
- Shows phase overview
- Links to all sub-pages
- Quick metrics summary
- Navigation to next/prev phase

Example: `phase-2-data-layer/index.html`
```
Phase 2: Data Layer Design
├─ Choosing a Database (Decision Tree)
├─ Replication Strategies (Deep dive)
├─ Sharding Strategies (Deep dive)
├─ Combining Repl + Sharding
├─ Data Consistency Across Services
└─ Indexing & Query Optimization

[Quick Metrics Summary]
PostgreSQL: 50K RPS, p99 < 50ms
Redis: 500K RPS, p99 < 1ms
DynamoDB: Unlimited, p99 ~ 1-3ms
Cassandra: 500K WPS, p99 < 10ms
```

---

### **Tier 2: Decision Trees** (interactive, self-contained)
Example: `phase-2-data-layer/choosing-database-tree.html`

Structure:
```html
<div class="breadcrumb">
  System Design > Phase 2: Data Layer > Choosing Database
</div>

<div class="step-counter">Step 0</div>

<div class="question">
  <h1>What is your primary bottleneck?</h1>
  <div class="options">
    <button data-path="read-heavy">
      1 Read-Heavy (most common)
      <span class="commonness">70% of systems</span>
    </button>
    <button data-path="write-heavy">
      2 Write-Heavy
      <span class="commonness">15% of systems</span>
    </button>
    <button data-path="mixed">
      3 Mixed Workload
      <span class="commonness">15% of systems</span>
    </button>
  </div>
</div>
```

Each tree navigates to **recommendations**, which are **separate pages**.

---

### **Tier 3: Recommendation Pages** (reusable template)
Example: `phase-2-data-layer/rec-redis-cache.html`

Single-file recommendation with:
```html
<div class="recommendation">
  <header>
    <span class="tech-badge">RD</span>
    <h1>Redis + Postgres Read Replica</h1>
    <p class="tagline">Handle 500K+ reads/s on cached paths</p>
  </header>

  <section class="pros-cons">
    <div class="pros">✅ Pros</div>
    <div class="cons">❌ Cons</div>
  </section>

  <section class="real-numbers">
    <h3>Real Numbers (Reference)</h3>
    <table>
      <tr><td>Redis single node</td><td>~500K RPS</td></tr>
      ...
    </table>
    <!-- METRICS INLINED even though in shared JS -->
    <p>At 10M DAU with 80% cache hit ratio...</p>
  </section>

  <section class="when-not-to-use">
    <h3>When NOT to Use ⚠️</h3>
    <ul>
      <li>If cache hit ratio < 60% → use Postgres replicas</li>
      <li>If consistency critical → use strong consistency DB</li>
    </ul>
  </section>

  <section class="scaling-limits">
    <h3>Scaling Limits 📊</h3>
    <ul>
      <li>Single Redis node: 500K RPS → Cluster for more</li>
      <li>Postgres replica: 50K QPS → Shard or Citus</li>
    </ul>
  </section>

  <section class="code-example">
    <h3>Implementation</h3>
    <pre><code>...</code></pre>
  </section>

  <section class="caveats">
    <h3>Gotchas 🚨</h3>
    <ul>
      <li>Cache stampede: When hot key expires...</li>
      <li>Replication lag: Read-your-own-writes pattern...</li>
    </ul>
  </section>

  <footer>
    <button onclick="history.back()">← Back</button>
    <button onclick="compare()">Compare Options</button>
    <button onclick="startOver()">Start Over</button>
  </footer>
</div>
```

**Key: Each recommendation is its own HTML, easy to update independently.**

---

### **Tier 4: Deep-Dive Pages** (topic explorations)
Example: `phase-2-data-layer/replication-strategies.html`

Not a decision tree, but comprehensive exploration:
```
Replication Strategies Deep Dive
├─ Primary-Replica (Master-Slave)
│  ├─ Synchronous vs Asynchronous
│  ├─ Real numbers (latency: +50-200ms)
│  ├─ When to use
│  └─ Failover strategies
├─ Multi-Leader (Active-Active)
│  ├─ Write conflict resolution
│  ├─ Real numbers (p99: < 10ms)
│  ├─ When to use
│  └─ Network partition handling
└─ Leaderless (Dynamo-style)
   ├─ Quorum reads & writes
   ├─ Real numbers (p99: < 100ms)
   └─ When to use
```

---

### **Tier 5: Quick Reference Pages** (bonus, high-value)
Example: `quick-reference/metrics-cheat-sheet.html`

Single page with **all metrics organized by technology**:
```
REDIS
├─ Throughput: 500K-1M RPS (single node)
├─ Latency p99: < 1ms
├─ Cost: $0.25/GB/month
├─ Max connections: 10,000-65,000
└─ When: Caching, sessions, leaderboards

POSTGRESQL
├─ Throughput: 50K RPS (reads), 5-10K RPS (writes)
├─ Latency p99: < 50ms
├─ Max connections: 200-400 (500 with pgBouncer)
├─ Scaling limit: > 500M rows → partition/shard
└─ When: OLTP, JOINs, ACID transactions

CASSANDRA
├─ Throughput: 500K-1M WPS
├─ Latency p99 LOCAL_ONE: < 1ms
├─ Latency p99 QUORUM: < 10ms
├─ Scaling: Linear (add nodes)
└─ When: Write-optimized, time-series
```

---

## BUILD ORDER & TOKEN MANAGEMENT STRATEGY

### **Phase 1: Shared Infrastructure** (Low token cost)
1. Create `base.css` — all styling
2. Create `metrics-reference.js` — all numbers
3. Create `navigation.js` — all nav logic
4. Create `components.js` — reusable UI

**Token cost**: ~5K tokens
**Time**: 1 session

### **Phase 2: Hub Pages** (Medium token cost)
5. Create `index.html` — main landing
6. Create all 11 `phase-X/index.html` pages (templates, easy)

**Token cost**: ~10K tokens
**Time**: 1 session

### **Phase 3: Decision Trees** (High token cost, but highest value)
7. `phase-2-data-layer/choosing-database-tree.html` (most important!)
8. Other decision trees (gradually)

**Token cost**: ~15K per tree
**Time**: 1 tree per session

### **Phase 4: Recommendations** (Batch by phase)
9. All Phase 2 recommendations (Redis, PostgreSQL, Cassandra, DynamoDB, Citus, etc.)
10. All Phase 3 recommendations (caching strategies)
11. All Phase 5 recommendations (messaging)
... etc.

**Token cost**: ~10K tokens per 3-4 recommendations
**Time**: Multiple sessions, batch recommendations together

### **Phase 5: Deep Dives** (Lower priority, can skip initially)
12. Replication strategies
13. Sharding strategies
... etc.

**Token cost**: ~10K per deep dive
**Time**: Fill in gradually

### **Phase 6: Case Studies** (Fun, high value, lower token cost)
13. Twitter design
14. Instagram design
... etc.

**Token cost**: ~8K per case study
**Time**: 1 case study per session

### **Phase 7: Quick Reference** (Final polish)
15. Metrics cheat sheet
16. Decision tree flowchart
17. Technology comparison matrix

**Token cost**: ~5K tokens
**Time**: 1 session

---

## TOTAL TOKEN ESTIMATE

```
Shared Infrastructure:     ~5K tokens
Hub Pages:                ~10K tokens
Decision Trees (5-6):     ~80K tokens
Recommendations (30-40):  ~120K tokens
Deep Dives (8-10):        ~80K tokens
Case Studies (12):        ~100K tokens
Quick Reference:          ~10K tokens
───────────────────────────────────
TOTAL:                    ~405K tokens across 10-15 sessions
```

**Why this works:**
- Each file is ~1-2K tokens max (easy to edit)
- Can parallelize — write case study while waiting for feedback on trees
- No single file bloats
- Easy to maintain metrics (update once in `metrics-reference.js`)

---

## DEPENDENCY MAP

```
base.css
  ↑
  └─← Every .html file

metrics-reference.js
  ↑
  ├─← phase-*/rec-*.html (embed metrics inline)
  ├─← quick-reference/metrics-cheat-sheet.html
  └─← phase-*/deep-dive-*.html

navigation.js
  ↑
  └─← Every .html file (breadcrumb, back, forward)

components.js
  ↑
  └─← phase-*/rec-*.html (ProsCons(), MetricsTable(), etc.)
```

**Implication: Build Tier 0 (shared) first, then everything else becomes easier.**

---

## RECOMMENDED BUILD SEQUENCE FOR MAX IMPACT

**Week 1-2: MVP (Most Valuable Product)**
1. ✅ Create shared infrastructure (css, js)
2. ✅ Create index.html (landing page)
3. ✅ Create phase-2-data-layer/index.html (hub)
4. ✅ Create phase-2-data-layer/choosing-database-tree.html (most important!)
5. ✅ Create 5-6 top recommendations (Redis, PostgreSQL, DynamoDB, Cassandra, Citus, ClickHouse)

**Why this order?**
- You immediately have a **working system** that you can use for interview prep
- The choosing-database-tree is the **most common interview question**
- Top 6 recommendations cover **80% of interview scenarios**

**Week 3+: Expand (Depth)**
6. Fill in remaining recommendations (all phases)
7. Create deep-dive pages (replication, sharding, caching strategies)
8. Create case studies (Twitter, Uber, Instagram)
9. Create quick reference pages

---

## FILE NAMING CONVENTION

**Decision Trees:**
- `choosing-database-tree.html` (verb-noun-tree)

**Recommendations:**
- `rec-redis-cache.html` (rec-technology-use-case)
- `rec-dynamodb.html`
- `rec-cassandra.html`

**Deep Dives:**
- `replication-strategies.html` (topic.html)
- `sharding-strategies.html`

**Case Studies:**
- `case-twitter.html`
- `case-uber.html`

**Quick Reference:**
- `metrics-cheat-sheet.html`
- `decision-tree-flowchart.html`

---

## DEPLOYMENT STRATEGY

Host on GitHub Pages (free, simple):
```
system-design-guide/
├── docs/
│   ├── index.html
│   ├── shared/
│   ├── phase-*/
│   └── quick-reference/
└── .git → Push to GitHub
```

Accessible at: `yourusername.github.io/system-design-guide`

---

## SUMMARY

✅ **Multi-file architecture** instead of monolithic HTML
✅ **Shared infrastructure** (CSS, JS, metrics) — update once, affect everywhere
✅ **Tiered complexity** — start with MVP (week 1-2), expand gradually
✅ **Low token cost per session** — ~10-20K per file, not 100K+ per monolith
✅ **Easy to maintain** — metrics centralized, templates reusable
✅ **Metrics everywhere** — both inline AND in reference tables
✅ **Scaling limits both ways** — in recommendations AND in scaling-limits sections
✅ **Mobile responsive** — base.css handles all breakpoints

---

## NEXT QUESTION FOR YOU

1. **Does this architecture make sense?** Any changes to the structure?
2. **Should I start building Phase 1** (shared infrastructure + index.html)?
3. **Or jump straight to Phase 2** (choosing-database-tree.html + recommendations)?

Let me know, and I'll start building! 🚀
