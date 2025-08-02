Build a "Chaos Engineering Lab" - An AI Model Testing Platform

  This project gives you excuses to use EVERY advanced feature while keeping the core app simple:

  Why This Project?

  - Simple core app: Just forwards requests to different AI providers
  - Complex infrastructure: Requires ALL the advanced patterns
  - Natural multi-tenancy: Different teams testing different models
  - Perfect for learning: You'll deliberately break things to learn how to fix them

  Core Application (Dead Simple)

  # The entire "business logic" in 20 lines
  @app.route('/api/v1/inference', methods=['POST'])
  def inference():
      model = request.json.get('model')
      prompt = request.json.get('prompt')

      # Route to provider based on model
      if model.startswith('gpt'):
          return call_openai(prompt)
      elif model.startswith('claude'):
          return call_anthropic(prompt)
      else:
          return call_local_ollama(prompt)

  But Here's Where It Gets Interesting...

  Infrastructure Challenges You'll Implement

  1. Multi-Region Deployment (Week 1)

  Deploy the SAME simple app across 3 "regions" (namespaces):
  - ai-lab-us-east
  - ai-lab-us-west
  - ai-lab-europe

  Learning: Cross-namespace networking, Istio multi-cluster setup, geo-routing

  2. Canary Deployments with A/B Testing (Week 2)

  - 10% traffic to new model versions
  - Header-based routing (X-Model-Version: beta)
  - Shadow traffic mirroring for testing

  Learning: Istio VirtualService weight-based routing, traffic mirroring

  3. Chaos Injection Points (Week 3)

  Build in deliberate failure modes:
  - /api/v1/chaos/latency - Add 5s delays
  - /api/v1/chaos/errors - Return 500s randomly
  - /api/v1/chaos/throttle - Simulate rate limits

  Learning: Istio fault injection, circuit breakers, retry policies

  4. Security Layers (Week 4)

  - mTLS between all services
  - Different auth methods per "region"
  - RBAC policies (dev team can only access dev models)

  Learning: Istio PeerAuthentication, AuthorizationPolicy, SPIFFE/SPIRE

  5. Observability Overload (Week 5)

  - Custom Envoy metrics for token usage
  - Distributed tracing across providers
  - Grafana dashboards for each namespace

  Learning: Istio telemetry v2, Prometheus ServiceMonitors, Jaeger

  6. Advanced Traffic Management (Week 6)

  - Locality-aware load balancing
  - Consistent hashing for model caching
  - Request hedging (send to multiple providers, use fastest)

  Learning: DestinationRule configurations, Envoy advanced features

  The "Chaos Scenarios" You'll Build

  Scenario 1: Provider Outage

  - OpenAI returns 503
  - Automatically failover to Anthropic
  - If both fail, use local Ollama
  - Alert ops team after 3 failures

  Scenario 2: Slow Model Response

  - GPT-4 taking >30s
  - Hedge request to Claude after 5s
  - Use whichever responds first
  - Track hedging effectiveness

  Scenario 3: Budget Exhaustion

  - Team A hits their OpenAI quota
  - Automatically switch to cheaper model
  - Queue non-critical requests
  - Send alerts at 80%, 90%, 100%

  Scenario 4: Security Breach Simulation

  - Detect unusual request patterns
  - Automatically enable strict mode
  - Force re-authentication
  - Isolate suspicious traffic

  Project Structure That Forces Learning

  ai-chaos-lab/
  ├── apps/
  │   ├── gateway/          # Simple Python/Go forwarding app
  │   ├── mock-openai/      # Fake OpenAI for testing
  │   ├── mock-anthropic/   # Fake Anthropic for testing
  │   └── chaos-injector/   # Webhook to inject failures
  ├── infrastructure/
  │   ├── namespaces/       # 6+ namespaces to manage
  │   ├── istio-system/     # Service mesh configs
  │   ├── cert-manager/     # Certificate automation
  │   └── monitoring/       # Full observability stack
  └── scenarios/
      ├── 01-provider-failure/
      ├── 02-latency-testing/
      ├── 03-security-breach/
      └── 04-budget-limits/

  Why This Works for Learning

  1. Simple App = More Time on Infrastructure
    - You're not debugging business logic
    - Focus entirely on OpenShift/Istio patterns
  2. Natural Complexity Growth
    - Start with one namespace, add more
    - Each "chaos scenario" teaches new concepts
    - Break things on purpose to learn fixes
  3. Every Advanced Feature Has a Purpose
    - mTLS: "Different teams shouldn't see each other's prompts"
    - Rate limiting: "Simulate provider quotas"
    - Circuit breakers: "Handle provider outages"
  4. Real-World Patterns
    - Multi-region deployment
    - Progressive rollouts
    - Disaster recovery
    - Cost optimization