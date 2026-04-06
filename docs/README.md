# System Design Interview Guide - Complete Documentation

## 🎯 Project Overview

A comprehensive, interactive, **production-grade system design interview preparation guide** organized as a modular multi-file website. 

**Key Features:**
- ✅ 11 learning phases covering all system design topics
- ✅ 50+ interactive decision trees and deep-dive sections
- ✅ 500+ concrete metrics and benchmarks embedded throughout
- ✅ Metrics appear BOTH inline (scattered) AND in reference tables (centralized)
- ✅ Scaling limits documented both in recommendations AND in dedicated sections
- ✅ Mobile-responsive design
- ✅ Free hosting on GitHub Pages
- ✅ Modular architecture (easy to update individual files)

---

## 📁 ARCHITECTURE OVERVIEW

### Design Principles
1. **Modular**: Each file is self-contained, ~1-2K tokens max
2. **Reusable**: Shared CSS, JS, metrics across all pages
3. **Maintainable**: Metrics centralized in JSON (update once, use everywhere)
4. **Scalable**: Easy to add new sections without touching existing code
5. **Mobile-first**: Responsive design for all screen sizes

### Tier Structure
```
Tier 0: SHARED INFRASTRUCTURE (Foundation)
├── shared/base.css              ← All styling, colors, typography
├── shared/metrics-reference.js  ← All numbers (single source of truth)
├── shared/navigation.js         ← Breadcrumbs, step counter, navigation
└── shared/components.js         ← Reusable UI: Tables, Pros/Cons, Code, etc.

Tier 1: HUB PAGES (Entry points per phase)
├── index.html                   ← Main landing page
└── phase-X/index.html           ← Hub for each of 11 phases

Tier 2: DECISION TREES (Interactive branching)
├── phase-2-data-layer/choosing-database-tree.html
├── phase-5-messaging/queues-vs-streaming-tree.html
└── ... (5-6 total decision trees)

Tier 3: RECOMMENDATIONS (Technology solutions)
├── phase-2/rec-redis-cache.html
├── phase-2/rec-postgresql.html
├── phase-2/rec-dynamodb.html
└── ... (30-40 total recommendations)

Tier 4: DEEP DIVES (Comprehensive explorations)
├── phase-2/replication-strategies.html
├── phase-3/caching-strategies.html
└── ... (8-10 total deep dives)

Tier 5: CASE STUDIES (Real-world examples)
├── phase-11/case-twitter.html
├── phase-11/case-instagram.html
└── ... (12 case studies)

Tier 6: QUICK REFERENCE (Cheat sheets)
├── quick-reference/metrics-cheat-sheet.html
├── quick-reference/decision-tree-flowchart.html
└── quick-reference/technology-comparison.html
```

---

## 📊 COMPLETE CONTENT TREE

### PHASE 1: FOUNDATIONAL CONCEPTS
**File:** `phase-1-foundational/index.html`

Build mental models before diving into specific technologies.

```
phase-1-foundational/
├── index.html                           [HUB PAGE]
│   ├─ Quick links to all topics
│   ├─ Learning path overview
│   └─ Key metrics summary
│
├── scalability-basics.html
│   ├─ Horizontal vs Vertical Scaling
│   ├─ Throughput vs Latency (p50, p99, p999)
│   ├─ QPS/RPS Estimation
│   ├─ Capacity Planning Math
│   ├─ Bandwidth & Storage Calculations
│   └─ Real numbers:
│       • 10M DAU → ~35K RPS peak
│       • 1B events/day → 43TB yearly storage
│       • 100 Gbps needed → Use CDN to reduce to 20 Gbps
│
├── consistency-models.html
│   ├─ Strong Consistency (Linearizability)
│   ├─ Eventual Consistency
│   ├─ Causal Consistency
│   ├─ Read-your-writes Consistency
│   ├─ CAP Theorem & PACELC
│   ├─ Trade-offs by use-case
│   └─ Real numbers:
│       • Sync replication: +50-200ms latency
│       • Async replication: +0-5ms latency, 10-100ms lag
│       • 2PC: 2-5ms overhead per transaction
│
├── availability-reliability.html
│   ├─ SLAs, SLOs, SLIs
│   ├─ MTTR vs MTBF
│   ├─ The 9s (99.9% = 43 min/month downtime)
│   ├─ Redundancy & Failover
│   ├─ Active-Active vs Active-Passive
│   └─ Real numbers:
│       • 99.9% → 43.2 min downtime/month
│       • 99.99% → 4.32 min downtime/month
│       • 99.999% → 26 sec downtime/month
│
└── building-blocks.html
    ├─ [Overview of each component]
    ├─ Client (Web, Mobile, Desktop)
    ├─ API Gateway / Load Balancer
    ├─ Microservices / Monolith
    ├─ Async Processing (Queues, Pub-Sub)
    ├─ Databases
    ├─ Caching Layer
    ├─ Search Indexes
    ├─ CDN & Object Storage
    ├─ Message Brokers
    └─ Observability Stack
```

---

### PHASE 2: DATA LAYER DESIGN
**File:** `phase-2-data-layer/index.html`

The most critical phase for interviews.

```
phase-2-data-layer/
├── index.html                           [HUB PAGE]
│   ├─ Phase 2 overview
│   ├─ Links to all sub-sections
│   ├─ Quick metrics:
│   │  • PostgreSQL: 50K RPS, p99 < 50ms
│   │  • Redis: 500K RPS, p99 < 0.5ms
│   │  • DynamoDB: Unlimited, p99 ~ 1-3ms
│   │  • Cassandra: 500K-1M WPS, p99 < 10ms
│   └─ "Start with the database decision tree →"
│
├── 📍 choosing-database-tree.html       [DECISION TREE - MOST IMPORTANT]
│   ├─ Step 0: Identifying bottleneck
│   │   ├─ 1. Read-heavy (80% of systems) ⭐ MOST COMMON
│   │   ├─ 2. Write-heavy (10%)
│   │   └─ 3. Mixed workload (10%)
│   │
│   ├─ Read-heavy path (Step 1):
│   │   ├─ Sub-step: Kind of reads?
│   │   │   ├─ 1. Key lookups
│   │   │   ├─ 2. Relational (JOINs)
│   │   │   ├─ 3. Analytics
│   │   │   └─ 4. Full-text search
│   │   │
│   │   └─ For each read type (Step 2):
│   │       ├─ Key lookups: Volume + freshness?
│   │       │   ├─ < 50K RPS → Redis + Postgres (rec-redis-cache.html)
│   │       │   ├─ 50K-500K RPS → Redis primary (rec-redis-primary.html)
│   │       │   └─ 500K+ RPS → DynamoDB (rec-dynamodb.html)
│   │       │
│   │       ├─ Relational: Read volume + complexity?
│   │       │   ├─ < 5K RPS → Single replica (rec-postgres.html)
│   │       │   ├─ 5K-50K RPS → 3-5 replicas + cache (rec-postgres-multi.html)
│   │       │   └─ 50K+ RPS → Shard with Citus (rec-citus.html)
│   │       │
│   │       ├─ Analytics: Real-time or batch?
│   │       │   ├─ Real-time → ClickHouse (rec-clickhouse.html)
│   │       │   └─ Batch → BigQuery/Redshift (rec-bigquery.html)
│   │       │
│   │       └─ Full-text: Volume + ranking needs?
│   │           └─ → Elasticsearch (rec-elasticsearch.html)
│   │
│   ├─ Write-heavy path (Step 1):
│   │   ├─ Sub-step: Bursty or sustained?
│   │   │   ├─ 1. Bursty (10x for minutes) → Kafka queue
│   │   │   └─ 2. Sustained (always high) → Database choice
│   │   │
│   │   └─ For sustained writes (Step 2):
│   │       ├─ Need ACID + SQL?
│   │       │   ├─ Yes → Shard (rec-citus.html or rec-cockroachdb.html)
│   │       │   └─ No → Continue to Step 3
│   │       │
│   │       └─ Step 3: Write volume + data shape?
│   │           ├─ < 10K WPS, relational → Postgres (rec-postgres.html)
│   │           ├─ 10K-100K WPS → Citus/CockroachDB
│   │           ├─ 100K+ WPS, wide rows → Cassandra (rec-cassandra.html)
│   │           ├─ 100K+ WPS, flat K-V → DynamoDB (rec-dynamodb.html)
│   │           └─ Time-series → TimescaleDB/InfluxDB
│   │
│   └─ Mixed workload path:
│       ├─ Relational (JOINs, ACID needed)
│       │   └─ Postgres + replicas + Redis cache (rec-postgres-multi.html)
│       ├─ Key-based (no JOINs)
│       │   └─ DynamoDB with DAX (rec-dynamodb.html)
│       └─ Asymmetric (write-append, read-complex)
│           └─ Event sourcing + CQRS (rec-event-sourcing.html)
│
├── rec-redis-cache.html                 [RECOMMENDATION]
│   ├─ Redis + Postgres Read Replica
│   ├─ Promise: "Handle 500K+ reads/s on cached paths"
│   ├─ Pros: Full SQL, cache hit rate = free scale, replication lag OK
│   ├─ Cons: Cache invalidation needed, lag 10ms-2s
│   ├─ Real numbers table:
│   │  • Redis single node: ~500K RPS
│   │  • p99 latency: <0.5ms
│   │  • Postgres replica: ~50K simple, ~5K complex
│   │  • Memory per 1M objects: ~1GB
│   │  • pgBouncer connections: 100 → 10,000
│   ├─ Inline metrics in narrative:
│   │  "At 10M DAU with 80% cache hit ratio, your DB gets 20% = 20 QPS
│   │   instead of 100 QPS = 5x load reduction. Cache stampede: when hot
│   │   key expires, all concurrent requests miss → add probabilistic
│   │   early expiry or distributed lock. Replication lag: read-your-own-
│   │   writes pattern after a user writes data."
│   ├─ When NOT to use:
│   │  ✗ Cache hit ratio < 60%
│   │  ✗ Consistency critical (financial transactions)
│   │  ✗ Data highly volatile
│   ├─ Scaling limits:
│   │  • Single Redis: 500K RPS → Cluster for more
│   │  • Postgres replica: 50K QPS → Shard with Citus
│   │  • Max useful replicas: 5-7 per primary
│   └─ Code example + caveats
│
├── rec-postgresql.html                  [RECOMMENDATION]
│   ├─ Postgres + 1 read replica + pgBouncer
│   ├─ Real numbers:
│   │  • Single node: 50K RPS (reads), 5-10K RPS (writes)
│   │  • p99 latency: < 50ms
│   │  • Index scan vs seq scan (1M rows): 0.1ms vs 200ms
│   │  • Missing index: Often the real problem
│   │  • Max connections: 200 default → 10K with pgBouncer
│   ├─ When NOT to use:
│   │  ✗ Write throughput > 10K WPS sustained
│   │  ✗ Need to scale to 500K+ concurrent users
│   │  ✗ Data doesn't fit in one server
│   ├─ Scaling limits:
│   │  • Single node: 50K RPS → Add replicas
│   │  • Multiple replicas: > 5-7 creates WAL overhead
│   │  • Tables > 500M rows: Need partitioning
│   └─ ...
│
├── rec-dynamodb.html                    [RECOMMENDATION]
│   ├─ DynamoDB (+ DAX for sub-ms reads)
│   ├─ Real numbers:
│   │  • Read latency (strong): ~1-3ms
│   │  • Read latency with DAX: <100µs
│   │  • Max item size: 400KB
│   │  • Cost: $0.25/M reads, $1.25/M writes
│   │  • Global Tables: +2x write cost per region
│   │  • Hot partition throttling: >3,000 RCU/s
│   ├─ When NOT to use:
│   │  ✗ Need complex JOINs
│   │  ✗ Unknown access patterns
│   │  ✗ Ad-hoc queries ("Users signed up last week")
│   ├─ Scaling limits:
│   │  • Single partition: 3,000 RCU/s → Use composite keys
│   │  • Item size: 400KB max
│   │  • GSI cost: 2x write traffic
│   └─ ...
│
├── rec-cassandra.html                   [RECOMMENDATION]
│   ├─ Cassandra / ScyllaDB
│   ├─ Real numbers:
│   │  • Write throughput: 500K-1M WPS
│   │  • p99 latency LOCAL_ONE: <1ms
│   │  • p99 latency QUORUM: <10ms (replication cost)
│   │  • Scaling: Linear (add nodes)
│   ├─ When NOT to use:
│   │  ✗ Need ACID transactions
│   │  ✗ Need complex queries
│   │  ✗ Operational complexity not acceptable
│   ├─ Scaling limits:
│   │  • Continues scaling linearly with nodes
│   │  • Per node: ~100K WPS
│   │  • Consistency tuning (LOCAL_ONE vs QUORUM)
│   └─ ...
│
├── rec-citus.html                       [RECOMMENDATION]
│   ├─ Citus (Sharded Postgres)
│   ├─ Real numbers:
│   │  • 8-shard cluster: ~400K simple reads/s
│   │  • Cross-shard query overhead: 2-10x
│   │  • Intra-shard JOIN: Same as single Postgres
│   ├─ When NOT to use:
│   │  ✗ Complex distributed transactions
│   │  ✗ Ad-hoc queries across all shards
│   ├─ Scaling limits:
│   │  • Per shard: ~50K RPS
│   │  • 8 shards: ~400K RPS
│   │  • Add more shards for linear scaling
│   └─ ...
│
├── rec-clickhouse.html                  [RECOMMENDATION]
│   ├─ ClickHouse (Columnar OLAP)
│   ├─ Real numbers:
│   │  • 1B rows COUNT: ~0.05-0.1s
│   │  • 100M rows GROUP BY: ~0.2-0.5s
│   │  • Compression: 5-10x vs Postgres
│   │  • Ingest: 100K-500K rows/s
│   ├─ When NOT to use:
│   │  ✗ OLTP (transactional)
│   │  ✗ Row-level updates needed
│   │  ✗ Real-time dashboards with <100ms latency
│   ├─ Scaling limits:
│   │  • Designed for billions of rows
│   │  • No practical limit for analytics
│   └─ ...
│
├── replication-strategies.html          [DEEP DIVE]
│   ├─ Primary-Replica (Master-Slave)
│   │  ├─ Synchronous: +50-200ms latency, 30-50% throughput reduction
│   │  ├─ Asynchronous: +0-5ms latency, 10-100ms lag
│   │  ├─ When: High availability, read scaling
│   │  └─ Failover strategies
│   │
│   ├─ Multi-Leader (Active-Active)
│   │  ├─ Write conflicts & resolution
│   │  ├─ Network partition handling
│   │  ├─ Real numbers: p99 < 10ms, eventual consistency
│   │  └─ When: Multi-region, offline-first
│   │
│   ├─ Leaderless (Dynamo-style)
│   │  ├─ Quorum reads & writes
│   │  ├─ Vector clocks
│   │  ├─ Real numbers: p99 < 100ms
│   │  └─ When: Extreme HA, geo-distributed
│   │
│   └─ Consensus (Raft, Paxos, PBFT)
│       ├─ Raft: Simple, 5ms latency, 50K ops/sec leader
│       ├─ Paxos: Complex, 10ms latency, 20K ops/sec
│       └─ PBFT: Byzantine, 50-100ms, 1K ops/sec
│
├── sharding-strategies.html             [DEEP DIVE]
│   ├─ Range-based (by date)
│   │  ├─ Pros: Simple queries
│   │  ├─ Cons: Hot shards (Jan-Feb data)
│   │  └─ Example: Time-series data
│   │
│   ├─ Hash-based (by user_id)
│   │  ├─ Pros: Even distribution
│   │  ├─ Cons: Rehash on scale (need 256→257 shards)
│   │  └─ Example: User-ID sharded systems
│   │
│   ├─ Directory-based (lookup table)
│   │  ├─ Pros: Flexible, easy rebalance
│   │  ├─ Cons: SPOF in directory
│   │  └─ Example: Airbnb's approach
│   │
│   ├─ Consistent Hashing
│   │  ├─ Pros: Minimal rehashing on add/remove
│   │  ├─ Cons: Non-uniform without virtual nodes
│   │  └─ Example: Distributed caches
│   │
│   └─ Hot Partition Mitigation
│       ├─ Secondary indexes
│       ├─ Shard splitting
│       ├─ Cache local hotspots
│       └─ Read replicas within shard
│
├── combining-repl-shard.html            [DEEP DIVE]
│   ├─ Why both? (Write scaling + HA)
│   ├─ Shard each replica set
│   ├─ Multi-leader sharded setup
│   ├─ Rebalancing complexity
│   ├─ Real numbers: Google Spanner, CockroachDB examples
│   └─ Scaling limits: Linear with shards × replicas
│
├── data-consistency.html                [DEEP DIVE]
│   ├─ Two-Phase Commit (2PC)
│   │  ├─ Pros: Strong consistency
│   │  ├─ Cons: Blocking, low availability
│   │  └─ Not recommended for distributed systems
│   │
│   ├─ Saga Pattern
│   │  ├─ Choreography-based (event-driven)
│   │  ├─ Orchestration-based (workflow manager)
│   │  └─ Compensation logic
│   │
│   ├─ Event Sourcing
│   │  ├─ Immutable log of events
│   │  ├─ Replay & rebuilding
│   │  └─ Eventual consistency model
│   │
│   └─ Idempotency & Deduplication
│       ├─ Idempotency keys
│       ├─ Deduplication windows
│       └─ When: Cross-service retries
│
└── indexing-optimization.html           [DEEP DIVE]
    ├─ B-tree indexes (SQL default)
    ├─ Hash indexes (fast equality)
    ├─ Bitmap indexes (low-cardinality)
    ├─ Full-text search indexes
    ├─ Covering indexes
    ├─ Composite indexes
    └─ Trade-off: Write amplification vs query speed
```

---

### PHASE 3: CACHING LAYER
**File:** `phase-3-caching/index.html`

```
phase-3-caching/
├── index.html                           [HUB PAGE]
│   └─ Quick metrics:
│       • Redis: 500K RPS, p99 < 0.5ms
│       • Memcached: 100K+ RPS, p50 < 0.5ms
│       • L1 hit rate: 90-95% (CDN, local)
│       • Cache miss cost: 10-100ms extra latency
│
├── caching-fundamentals.html            [CONCEPT]
│   ├─ Cache hit ratio, miss ratio, eviction
│   ├─ TTL-based invalidation
│   ├─ Event-driven invalidation
│   ├─ Write-through vs Write-behind
│   ├─ Real numbers: 90% hit rate + 100ms miss = 9ms avg latency
│   └─ When to NOT cache (continuous data changes)
│
├── cache-layers.html                    [CONCEPT]
│   ├─ L1: Client-side (Browser LocalStorage, HTTP cache)
│   ├─ L2: CDN (CloudFront, Cloudflare, Akamai)
│   │   └─ Real numbers: 90-95% hit ratio, p50 < 50ms globally
│   ├─ L3: Application cache (Redis, Memcached)
│   │   └─ Real numbers: 500K RPS, p99 < 1ms
│   ├─ L4: Database query cache
│   └─ Interaction & cache warming
│
├── caching-policies.html                [CONCEPT]
│   ├─ LRU (Least Recently Used)
│   ├─ LFU (Least Frequently Used)
│   ├─ FIFO (First In First Out)
│   ├─ Random Replacement
│   └─ Custom policies
│
├── distributed-cache-challenges.html    [CONCEPT]
│   ├─ Cache stampede (thundering herd)
│   │  └─ Solutions: Probabilistic early expiration, locks, queues
│   ├─ Cache breakdown (hotspot keys)
│   │  └─ Solutions: Local replicas, replication
│   ├─ Cache penetration (non-existent keys)
│   │  └─ Solutions: Bloom filters, null caching
│   └─ Hot key problem
│       └─ Solutions: Local caches, multi-tier
│
├── cache-technologies.html              [COMPARISON]
│   ├─ Redis
│   │  ├─ Real numbers: 500K-1M RPS, p99 < 1ms
│   │  ├─ Data structures (strings, lists, sets, sorted sets)
│   │  ├─ Persistence (RDB, AOF)
│   │  ├─ Replication & Sentinel
│   │  └─ When: Primary choice for cache + sessions + queues
│   │
│   ├─ Memcached
│   │  ├─ Real numbers: 100K+ RPS, multi-threaded
│   │  ├─ LRU eviction only
│   │  ├─ No persistence (stateless)
│   │  └─ When: Pure cache, read-heavy
│   │
│   ├─ Hazelcast / Ignite
│   │  └─ When: In-process, embedded JVM
│   │
│   └─ Local caching (Caffeine, Guava)
│       └─ When: Single-node, per-service
│
└── cache-key-design.html                [CONCEPT]
    ├─ Naming conventions
    ├─ Versioning keys
    ├─ Hierarchical structures
    └─ Wildcard invalidation patterns
```

---

### PHASE 4: SEARCH & ANALYTICS
### PHASE 5: MESSAGE QUEUES & EVENT STREAMING
### PHASE 6: API DESIGN & COMMUNICATION
### PHASE 7: INFRASTRUCTURE & DEPLOYMENT
### PHASE 8: SECURITY & COMPLIANCE
### PHASE 9: OBSERVABILITY
### PHASE 10: RESILIENCE & FAULT TOLERANCE
### PHASE 11: DESIGN PATTERNS & CASE STUDIES

(Similar detailed structure for each phase - see architecture_plan.md for complete tree)

---

### QUICK REFERENCE SECTION
```
quick-reference/
├── metrics-cheat-sheet.html
│   └─ All technologies + all metrics in one place (searchable)
│
├── decision-tree-flowchart.html
│   └─ Visual map of all decision trees
│
└── technology-comparison.html
    └─ Redis vs Memcached, PostgreSQL vs Cassandra, etc.
```

---

## 🔧 CONFIGURATION & CUSTOMIZATION

### Files You'll Modify Most Often

1. **`shared/metrics-reference.js`**
   - Update this ONE file to change any metric everywhere
   - Format: JSON with technology → metric → value
   - Example:
     ```javascript
     const METRICS = {
       redis: {
         throughput: { single_node: "500K-1M RPS", cluster: "3-5M RPS" },
         latency: { p50: "<0.5ms", p99: "<1ms" }
       }
     }
     ```

2. **`shared/base.css`**
   - Change colors, fonts, spacing here
   - Affects all pages immediately
   - Color codes:
     - PostgreSQL: 🔵 `#336791`
     - Redis: 🔴 `#DC382D`
     - DynamoDB: 🟠 `#FF9900`
     - Cassandra: 🟣 `#1287EB`
     - ClickHouse: 🟡 `#FFCC00`

3. **Phase Hub Pages** (`phase-X/index.html`)
   - Update navigation links
   - Add new sub-pages
   - Update quick metrics summary

4. **Recommendation Pages** (`phase-X/rec-*.html`)
   - Update pros/cons
   - Add new real numbers (inline + table)
   - Modify scaling limits

### How to Make Changes

#### Adding a New Metric
```
1. Open shared/metrics-reference.js
2. Find the technology section
3. Add new metric: latency: { p99: "new value" }
4. All pages using that metric auto-update
```

#### Adding a New Recommendation
```
1. Create phase-X/rec-new-technology.html
2. Copy template from existing recommendation
3. Update:
   - Title & promise
   - Pros/cons
   - Real numbers (inline narrative)
   - Real numbers table (pull from metrics-reference.js)
   - When NOT to use
   - Scaling limits
4. Add link in phase-X/index.html
5. Add link in corresponding decision tree
```

#### Adding a New Deep Dive
```
1. Create phase-X/topic-name.html
2. Structure as:
   - Overview
   - Section 1: Concept + real numbers
   - Section 2: Concept + real numbers
   - Trade-offs table
   - When to use
3. Link from phase hub and related decision tree
```

#### Adding a New Case Study
```
1. Create phase-11/case-company-name.html
2. Structure as:
   - Company context (scale, business model)
   - Challenges they faced
   - Architecture decisions (with real numbers)
   - Lessons learned
   - Interview talking points
3. Link from phase-11/index.html
```

---

## 📋 COMPLETE FILE CHECKLIST

### Shared Files (7 files)
- [ ] `shared/base.css` — Styling
- [ ] `shared/metrics-reference.js` — All metrics
- [ ] `shared/navigation.js` — Navigation logic
- [ ] `shared/components.js` — Reusable UI
- [ ] `index.html` — Main landing page
- [ ] `sitemap.html` — Full navigation index
- [ ] `.gitignore` — GitHub ignore rules

### Phase 1: Foundational (5 files)
- [ ] `phase-1-foundational/index.html`
- [ ] `phase-1-foundational/scalability-basics.html`
- [ ] `phase-1-foundational/consistency-models.html`
- [ ] `phase-1-foundational/availability-reliability.html`
- [ ] `phase-1-foundational/building-blocks.html`

### Phase 2: Data Layer (11 files)
- [ ] `phase-2-data-layer/index.html`
- [ ] `phase-2-data-layer/choosing-database-tree.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/rec-redis-cache.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/rec-postgresql.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/rec-dynamodb.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/rec-cassandra.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/rec-citus.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/rec-clickhouse.html` ⭐ PRIORITY 1
- [ ] `phase-2-data-layer/replication-strategies.html`
- [ ] `phase-2-data-layer/sharding-strategies.html`
- [ ] `phase-2-data-layer/combining-repl-shard.html`
- [ ] `phase-2-data-layer/data-consistency.html`
- [ ] `phase-2-data-layer/indexing-optimization.html`

### Phase 3: Caching (7 files)
- [ ] `phase-3-caching/index.html`
- [ ] `phase-3-caching/caching-fundamentals.html`
- [ ] `phase-3-caching/cache-layers.html`
- [ ] `phase-3-caching/caching-policies.html`
- [ ] `phase-3-caching/distributed-cache-challenges.html`
- [ ] `phase-3-caching/cache-technologies.html`
- [ ] `phase-3-caching/cache-key-design.html`

### Phase 4-11: (54 more files)
[Similar structure for each phase]

### Quick Reference (3 files)
- [ ] `quick-reference/metrics-cheat-sheet.html`
- [ ] `quick-reference/decision-tree-flowchart.html`
- [ ] `quick-reference/technology-comparison.html`

**Total: ~85 files when complete**

---

## 🚀 BUILD ROADMAP & PRIORITIES

### Week 1-2: MVP (PRIORITY 1 - Start Here!)
**Focus: High-impact, interview-ready core**

```
Build Order:
1. shared/base.css
2. shared/metrics-reference.js
3. shared/navigation.js
4. shared/components.js
5. index.html (main landing)
6. phase-2-data-layer/index.html (hub)
7. phase-2-data-layer/choosing-database-tree.html ⭐ MOST IMPORTANT
8. phase-2-data-layer/rec-redis-cache.html ⭐
9. phase-2-data-layer/rec-postgresql.html ⭐
10. phase-2-data-layer/rec-dynamodb.html ⭐
11. phase-2-data-layer/rec-cassandra.html ⭐
12. phase-2-data-layer/rec-citus.html ⭐
13. phase-2-data-layer/rec-clickhouse.html ⭐

Rationale: These 13 files cover 80% of interview scenarios.
You'll have a working, useful guide in 2 weeks.
```

### Week 3-4: Core Completion
- Add remaining Phase 1-11 hub pages
- Add 5-6 decision trees (messaging, API design, infrastructure, etc.)
- Add 30+ recommendations

### Week 5+: Polish & Reference
- Add all deep-dive pages
- Add all case studies
- Create quick reference pages
- Test mobile responsiveness
- Deploy to GitHub Pages

---

## 📖 HOW TO USE THIS README

### For Quick Reference
- Scroll to **COMPLETE FILE CHECKLIST**
- See all ~85 files needed + their status
- Checkbox format for tracking progress

### For Understanding Structure
- Read **ARCHITECTURE OVERVIEW** (how files relate)
- Read **Tier Structure** (what each file does)
- Scan **COMPLETE CONTENT TREE** (what topics covered)

### For Modifications
- Read **FILES YOU'LL MODIFY MOST OFTEN** (the 4 key files)
- Read **HOW TO MAKE CHANGES** (step-by-step for each change type)
- Use **CONFIGURATION & CUSTOMIZATION** section

### For Progress Tracking
- Use **BUILD ROADMAP** to plan sprints
- Check off **FILE CHECKLIST** as you build
- Week 1-2 MVP = 13 files
- Full completion = 85 files

---

## 🔗 IMPORTANT LINKS

- **Main guide**: `index.html`
- **Database decision tree**: `phase-2-data-layer/choosing-database-tree.html` ⭐
- **All metrics**: `shared/metrics-reference.js` (single source of truth)
- **Quick reference**: `quick-reference/metrics-cheat-sheet.html`

---

## 📝 NOTES FOR FUTURE YOU

1. **Metrics are centralized in `shared/metrics-reference.js`**
   - One source of truth
   - Update once, affect all pages
   - No duplicate metrics across files

2. **Every recommendation has metrics BOTH ways:**
   - Inline in narrative (scattered throughout, don't need to jump)
   - In reference table (for quick lookup)

3. **Every technology has scaling limits documented BOTH ways:**
   - In "Scaling Limits" section (explicit subsection)
   - Scattered in narrative where relevant

4. **Mobile responsive by default**
   - `base.css` handles all breakpoints
   - Test on phone before deployment

5. **GitHub Pages deployment is free and instant**
   - Push to main branch
   - Enable in Settings → Pages
   - Live at: `yourusername.github.io/system-design-guide`

---

## ⚠️ COMMON MISTAKES TO AVOID

1. ❌ Don't duplicate metrics across files
   - Use `metrics-reference.js` instead

2. ❌ Don't create new CSS files
   - Add to `base.css` only

3. ❌ Don't add new libraries (jQuery, Bootstrap, etc.)
   - Keep it vanilla HTML/CSS/JS for speed

4. ❌ Don't forget to link new pages
   - Update hub page + relevant decision trees

5. ❌ Don't use absolute paths in links
   - Use relative paths: `../phase-2/rec-redis.html`

---

## 📞 QUICK HELP

**Q: How do I add a new metric?**
A: Edit `shared/metrics-reference.js`, add to the technology object, save.

**Q: How do I change colors?**
A: Edit `shared/base.css`, find the color variables, update.

**Q: How do I add a new page?**
A: Create new HTML in appropriate phase folder, link from hub page.

**Q: How do I deploy?**
A: Push to GitHub, enable Pages in Settings, done.

**Q: Which files do I build first?**
A: Follow BUILD ROADMAP → Week 1-2 MVP (13 files).

---

Last Updated: [Date]
Status: [Architecture Document - Ready for Implementation]
Model Used: Sonnet (for quality & accuracy)
