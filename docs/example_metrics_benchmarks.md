# CONCRETE METRICS & BENCHMARKS FOR SYSTEM DESIGN
## Examples of "shiny" content that makes you stand out in interviews

---

## CACHING PERFORMANCE & METRICS

### Redis Performance Benchmarks
**Single-threaded, single instance:**
- **Throughput**: 50,000 - 100,000 RPS (requests per second) for SET operations
- **Throughput**: 100,000 - 150,000 RPS for GET operations (reads are faster)
- **Latency**: p50 < 1ms, p99 < 5ms under normal load
- **Memory overhead**: ~1KB per key-value pair (string) + ~500 bytes Redis overhead
- **Max recommended connections per instance**: 10,000 - 65,000 (depends on OS ulimit)
- **Network bandwidth**: Can handle ~1 Gbps (125 MB/s) of network I/O

**Realistic production setup (Redis Cluster):**
- **Throughput**: 500,000 - 1,000,000 RPS across 10-node cluster
- **Cost**: ~$0.25/GB/month (AWS ElastiCache) to ~$0.10/GB/month (self-hosted)

### Memcached Performance Benchmarks
- **Throughput**: 100,000+ RPS (multi-threaded, better than Redis for pure GET)
- **Latency**: p50 < 0.5ms, p99 < 2ms
- **No persistence**: Lost on restart (acceptable for cache)
- **Memory overhead**: Slightly lower than Redis (~200 bytes per key)
- **Best for**: Read-heavy workloads, simple key-value

### Cache Miss Cost Analysis
**Scenario: 10M DAU, 80% read ratio, 100 RPS at peak**
```
Cache hit ratio: 90%
- 90 RPS → Redis (fast, ~1ms)
- 10 RPS → Database (slow, ~100ms)
- Average latency: (90 × 1ms + 10 × 100ms) / 100 = 10.9ms ✓

Cache hit ratio: 80% (cache degradation)
- 80 RPS → Redis (~1ms)
- 20 RPS → Database (~100ms)
- Average latency: (80 × 1ms + 20 × 100ms) / 100 = 20.8ms (2x slower!) ✗

Cache hit ratio: 70% (severe degradation)
- Average latency: 30.9ms (3x slower)
- Database QPS goes from 10 to 30 → risk of cascading failure
```

### Cache Invalidation Patterns & TTL Trade-offs
```
Product catalog (slow-changing data):
- TTL: 24 hours
- Reasoning: 99.99% hit rate, stale data acceptable
- Storage: 1M products × 5KB = 5GB

User profile (frequently changing):
- TTL: 5 minutes
- Reasoning: Balance between freshness & hit rate
- At 10M users × 10KB = 100GB total (only hot users cached, ~1M active)

Session data (security-sensitive):
- TTL: 30 minutes
- Reasoning: Security + user context
- At 100K concurrent users × 2KB = 200MB

Real-time metrics (hot data):
- TTL: 1 second (refresh on write)
- Reasoning: Accuracy > cache efficiency
```

---

## DATABASE PERFORMANCE & CAPACITY

### PostgreSQL Performance (Single Instance)
**Typical specs: 16 CPU, 64GB RAM, NVMe SSD**
- **Read throughput**: 20,000 - 50,000 QPS (queries per second)
- **Write throughput**: 5,000 - 10,000 QPS (writes are slower due to WAL)
- **Latency**: p50 < 5ms, p99 < 50ms for simple queries
- **Index lookup**: O(log N) ~ 7-10 disk seeks for 1M rows
- **Full table scan**: 1-10 seconds per GB of data
- **Connection limit**: 200-400 connections (each ~5MB RAM)

### Cassandra (NoSQL, Write-optimized)
**Cluster of 10 nodes, 100GB per node**
- **Write throughput**: 500,000 - 1,000,000 WPS (writes to local node + async replication)
- **Read throughput**: 100,000 - 300,000 RPS (depends on consistency level)
- **Latency (LOCAL_ONE)**: p50 < 1ms, p99 < 10ms
- **Latency (QUORUM)**: p50 < 5ms, p99 < 50ms (replication wait)
- **Data retention**: Efficient for time-series (1 byte overhead per timestamp)

### DynamoDB (Managed, AWS)
**On-demand pricing (~$1.50 per million write units, ~$0.30 per million read units)**
- **Write throughput**: Scales to millions WPS (auto-scaling, no provisioning)
- **Read throughput**: Scales to millions RPS (auto-scaling)
- **Latency**: p50 < 10ms, p99 < 100ms
- **Storage cost**: $0.25/GB/month
- **Consistency**: Strong reads cost 2x RCU; eventual reads cost 0.5x RCU
- **Best for**: Variable load, serverless, global scale

---

## REPLICATION & SHARDING OVERHEAD

### Replication Impact
**Synchronous replication (strong consistency):**
- **Latency increase**: +50-200ms (waiting for replica confirmation)
- **Throughput reduction**: 30-50% (write amplification)
- **Use case**: Financial transactions, critical data
- **Example**: Synchronous replication to 2 replicas = 3x write traffic

**Asynchronous replication (eventual consistency):**
- **Latency increase**: 0-5ms (only local write, replica catches up in background)
- **Throughput**: No reduction (writes return immediately)
- **Replication lag**: Typically 10-100ms, can spike during high load
- **Use case**: Social feeds, recommendations, analytics

### Sharding Costs & Trade-offs
**Hash-based sharding (by user_id) into 256 shards:**
```
Perfect distribution: ✓
- Each shard handles 1/256th of traffic
- 10M users → ~40K users per shard
- If write ratio is 5%, each shard: ~2 QPS (10K users × 0.2 writes/user/day)

Query complexity: ✗
- Cross-shard query: Must hit all 256 shards, aggregate results
- "Get all posts by friends" → Scatter-gather, slow
- Latency: p99 could be 500ms-1s (slow tail of 256 shard queries)

Hot shards: ⚠️
- Celebrity user (1M followers) → One shard gets 10x traffic
- Mitigation: Secondary sharding (shard within shard), local caching

Rebalancing: ✗
- Add 257th shard → Need to rehash all 10M users
- Downtime: Minutes to hours depending on DB size
- Solution: Consistent hashing or directory-based sharding
```

---

## MESSAGE QUEUE PERFORMANCE

### Kafka Performance (Cluster of 5 brokers)
- **Throughput**: 500K - 5M messages/second (depends on message size)
- **Message size**: Typically 100-10K bytes
- **Latency (p99)**: < 100ms end-to-end (producer → broker → consumer)
- **Throughput per partition**: ~100K msg/s (publish), ~200K msg/s (consume)
- **Max partitions per cluster**: 10,000+ (each partition = separate disk queue)
- **Disk overhead**: 100GB of messages = 110-120GB on disk (with replication factor 3)
- **Consumer lag**: Can track millions of consumers per cluster

**Cost analysis (AWS MSK):**
- Per GB of storage: ~$0.10/month
- 1TB retention: ~$100/month
- 1 Gbps throughput: requires cluster upsize

### RabbitMQ (Traditional message queue)
- **Throughput**: 50K - 500K msg/s (slower than Kafka, but lower latency for single consumer)
- **Latency (p99)**: < 10ms (optimized for point-to-point)
- **Memory hungry**: Message batches held in RAM (~500MB per 100K messages)
- **Best for**: Task queues, work distribution, complex routing (exchanges)

### AWS SQS (Managed, serverless)
- **Throughput**: Effectively unlimited (auto-scaling)
- **Latency**: p99 ~ 50-200ms
- **Cost**: $0.40 per million requests (+ data transfer)
- **Best for**: Decoupling, simplicity, variable load
- **Limitation**: Only 120,000 in-flight messages per queue

---

## API RATE LIMITING CALCULATIONS

### Token Bucket Algorithm (Redis-backed)
**Scenario: API limit 1000 req/min per user**
```
Bucket capacity: 1000 tokens
Refill rate: 1000 tokens / 60 seconds = 16.67 tokens/second

User 1 (normal usage):
- Sends 10 req at t=0s → 10 tokens consumed, 990 left
- Sends 5 req at t=2s → 5 consumed, but 33 refilled (2s × 16.67) → 1000 (capped)
- Happy user ✓

User 2 (burst):
- Sends 2000 req at t=0s → Only first 1000 allowed, rest rejected (429)
- Waits 60s, tokens refill → 1000 more available at t=60s
- Prevents thundering herd ✓

Redis operations per request: 
- 2 ops (GET bucket state, SET bucket state) = 2 µs
- 1000 req/min per user × 10M users = 167K req/s globally
- = 334K Redis ops/s = cheap for a single Redis cluster
```

### Leaky Bucket Algorithm
- **Egress rate**: 1000 requests/min = 16.67 req/sec
- **Queue size**: 10,000 (burst capacity)
- **Behavior**: Smooth traffic, but slower rejection (queues, then drops)

---

## NETWORK & BANDWIDTH CALCULATIONS

### Typical Bandwidth Requirements
**10M DAU, average session 30 min, 100 API calls per session**
```
Daily API calls: 10M × 100 = 1B calls
Peak QPS: (1B / 86400) × 3 (3x peak multiplier) = 34,722 QPS

Avg response size: 5KB
Peak bandwidth: 34,722 QPS × 5KB = 173 Gbps (!)

Mitigation:
- Compression (gzip): 5KB → 1KB (5x reduction)
- CDN for static assets: Remove 20% of traffic
- Effective bandwidth: 173 Gbps × 0.8 × 0.2 = 27 Gbps (manageable)

Cost at AWS:
- Data transfer out: $0.02/GB
- 27 Gbps × 86400 sec = 233 PB/month = $4.66M/month ✗
- Solution: Use CloudFront CDN ($0.085/GB) + caching
```

---

## STORAGE CAPACITY CALCULATIONS

### User-Generated Content (UGC) Scaling
**Scenario: Photo-sharing app, 10M DAU**
```
Assumptions:
- Each user uploads 2 photos/month on average
- Photo size: 3MB average (compressed JPEG)
- Retention: 5 years

Monthly new photos: 10M × 2 = 20M photos
Monthly storage added: 20M × 3MB = 60TB/month

Annual growth: 60TB × 12 = 720TB/year
5-year storage: 720TB × 5 = 3.6PB

Cost (S3 Standard):
- 3.6PB = 3.6M GB
- Storage: 3.6M × $0.023 = $82,800/year
- GET requests: 3.6PB viewed (hot: 10%, cold: 90%)
- 360PB × 0.10 × ($0.0004/1000) = $144/year (negligible)
- Total: ~$83K/year for photo storage (reasonable for 10M DAU)
```

### Metadata Storage (Indexes, Logs)
**1B events/day (10M DAU × 100 events/day)**
```
Event size: 200 bytes (timestamp, user_id, action, context)
Daily: 1B × 200B = 200GB
Per year: 200GB × 365 = 73TB

Storage tiers:
- Hot (0-30 days): Elasticsearch cluster
  - 6TB (30 days hot) × $0.35/GB/month = $2.1K/month
- Warm (1-6 months): S3 (archived/compressed)
  - 36TB compressed (10:1 ratio) = 3.6TB × $0.025 = $90/month
- Cold (1+ years): Glacier
  - 10+ years × 365 × 200GB = ~730TB × $0.004 = $2.9K/month

Total: ~$5K/month for 1B event/day logging (reasonable)
```

---

## CDN & EDGE CACHING

### CloudFront / Akamai Performance
**Static assets (JS, CSS, images):**
- **Cache hit ratio**: 90-95% (edge caches in 200+ locations globally)
- **Latency**: p50 < 50ms worldwide (served from nearest edge)
- **Bandwidth savings**: 80% reduction (if 100 Gbps needed, only 20 Gbps from origin)
- **Cost**: $0.085/GB (vs S3 $0.02/GB, but faster + distributes load)

**Typical CDN miss cost:**
- Miss = request goes to origin (S3)
- Latency: 100-300ms instead of 50ms
- But only 5-10% of traffic, so p99 acceptable

---

## AUTO-SCALING METRICS

### Kubernetes HPA (Horizontal Pod Autoscaler)
**Default settings for a Spring Boot service:**
```
Target CPU: 80%
Target Memory: 85%
Replica count: 3-100 pods
Scale-up delay: 15 seconds
Scale-down delay: 5 minutes

Scenario: Traffic spike from 100 RPS to 500 RPS
- Detection: HPA sees CPU go to 95% (+ requests queuing)
- Action: Scale from 10 → 30 pods (200% increase)
- Time: 15s detection + 30s pod startup = 45s total
- Result: Handles spike without exhausting existing pods

Cost impact:
- 1 pod (small): ~$15/month (AWS t3.small)
- 100 pods: $1500/month
- Auto-scaling prevents paying for peak all the time
```

---

## LATENCY SLA TARGETS BY COMPONENT

### P50, P99, P999 Breakdown (E-commerce example)
```
SLO Target: p99 < 500ms for homepage load

Breakdown:
- Browser (client): 50ms (DNS, TLS handshake)
- CDN edge: 10ms (edge router logic)
- API Gateway: 5ms (auth, routing)
- Backend service A: 150ms (business logic)
  - Network: 10ms
  - Service processing: 100ms
  - Cache lookup: 20ms (miss → DB: 100ms)
  - Serialization: 20ms
- Backend service B: 100ms (dependent call)
- Database: 50ms (read)
- Response serialization + CDN: 20ms

Total: 50 + 10 + 5 + 150 + 100 + 50 + 20 = 385ms (p50)

P99 breakdown (tail latencies):
- Browser: 100ms (slower network)
- CDN: 30ms (cold cache hit)
- API GW: 10ms (load spike)
- Service A: 300ms (GC pause, lock contention)
- Service B: 200ms (downstream slow)
- Database: 200ms (slow query on unindexed column)
- Serialization: 50ms
Total p99: ~890ms (exceeds 500ms SLO!) ✗

Mitigation:
- Add read replicas (p99 → 300ms)
- Caching hotspots (p99 → 200ms)
- Async for non-critical (p99 → 150ms)
```

---

## CONSISTENCY TRADEOFF COSTS

### Strong vs Eventual Consistency Impact
**User follow system (Twitter-like)**
```
Strong consistency (2PC, synchronous):
- Latency: +100ms (confirm across 2 regions)
- Throughput: 50% reduction (blocking)
- Use: Financial transfers
- Cost: Slow user experience

Eventual consistency (async replication):
- Latency: < 5ms (local write)
- Throughput: 2x (no blocking)
- Replication lag: 50-500ms
- Use: Social feeds, follows
- Trade-off: For 0.5-1 second, your follow count might not be fully updated
- Cost: User visible lag (acceptable for social)
```

---

## COST COMPARISON: MONOLITH vs MICROSERVICES

### Infrastructure Cost @ 10M DAU
```
MONOLITH:
- 10 servers (2x redundancy, 2x headroom) × $500/month = $5K
- Database (managed RDS): $2K
- Cache (small Redis): $500
- CDN: $5K
- Ops staff: 2 FTE × $150K = $300K/year
Total: ~$350K/year

MICROSERVICES (10 services):
- 100+ containers × $30/month (spot pricing) = $3K
- 5 databases (polyglot) × $1.5K = $7.5K
- 2x Redis, Elasticsearch, etc. = $5K
- CDN: $5K
- Ops staff: 5 FTE (more complex) × $150K = $750K/year
Total: ~$780K/year (2x cost!)

Breakeven: Need 100M+ DAU or extremely complex domain
```

---

## MONITORING & OBSERVABILITY COSTS

### Log storage cost explosion
```
100K RPS × 5 log lines per request = 500K log lines/second
= 50M log lines per 100 seconds
= 432B log lines per day (uncompressed, 100 bytes each = 43TB)

ElasticSearch storage:
- 7-day retention (hot): 300GB = $105/day = $3150/month
- 30-day retention: $13.5K/month
- 1-year retention: $150K/month (unsustainable)

Solution:
- Log sampling: Only 10% of requests in Elasticsearch
- 30-day: $1.35K/month
- Archive to S3: Full logs in Glacier for compliance
- Cost: ~$2K/month (Elasticsearch) + $500/month (cold storage)
```

---

## CONSENSUS ALGORITHM COSTS

### Raft vs Paxos
```
Raft (leader-based):
- Latency: p50 5ms (leader + 1 follower confirmation)
- Throughput: 50K ops/sec per leader
- Complexity: Simple, easier to reason about
- When: Most systems (etcd, Consul)

Paxos (leaderless):
- Latency: p50 10ms (parallel quorum)
- Throughput: 20K ops/sec (need quorum)
- Complexity: Byzantine, hard to implement
- When: Specialized systems (Google Chubby)

Byzantine Fault Tolerance (PBFT):
- Latency: p50 50-100ms (complex voting)
- Throughput: 1K ops/sec (lots of messages)
- When: Blockchain, untrusted participants only
```

---

## SUMMARY TABLE: Quick Reference

| Component | Throughput | Latency (p99) | Cost/Month | Notes |
|-----------|-----------|--------------|-----------|-------|
| Redis (single) | 100K RPS | <5ms | $100 | L1 cache |
| PostgreSQL (single) | 10K QPS | <50ms | $2K | OLTP |
| Cassandra (10 nodes) | 500K WPS | <10ms | $15K | Write-optimized |
| Kafka (5 brokers) | 1M msg/s | <100ms | $5K | Event streaming |
| Elasticsearch (cluster) | 100K writes/s | <100ms | $10K | Full-text search |
| CloudFront | Unlimited | <50ms | $0.085/GB | CDN |
| DynamoDB (on-demand) | Unlimited | <100ms | Variable | Serverless |
| RabbitMQ (cluster) | 500K msg/s | <10ms | $3K | Task queues |
| Kubernetes (100 pods) | Scales to 500K RPS | <200ms | $1.5K | Orchestration |

