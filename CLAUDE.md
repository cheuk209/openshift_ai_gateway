# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an enterprise-grade AI gateway designed for OpenShift environments with a focus on security, multi-tenancy, and production readiness. The project aims to provide secure, managed access to AI/ML models (particularly LLMs) in financial services contexts.

## Project Structure

The intended directory structure using Kustomize for multi-environment management:
```
openshift-ai-gateway/
├── README.md                  # Project overview and architecture diagrams
├── docs/                      # Detailed setup and API documentation
├── manifests/                 # Kubernetes/OpenShift YAML files with Kustomize
│   ├── base/                  # Base resources shared across environments
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   ├── serviceaccount.yaml
│   │   └── rbac.yaml
│   └── overlays/              # Environment-specific configurations
│       ├── dev/
│       │   ├── kustomization.yaml
│       │   ├── configmap-patch.yaml
│       │   ├── deployment-patch.yaml
│       │   ├── route.yaml
│       │   └── secrets/       # Dev secrets (GitOps sealed secrets)
│       └── prod/
│           ├── kustomization.yaml
│           ├── configmap-patch.yaml
│           ├── deployment-patch.yaml
│           ├── route.yaml
│           ├── hpa.yaml      # Horizontal Pod Autoscaler
│           ├── pdb.yaml      # Pod Disruption Budget
│           └── secrets/       # Prod secrets (GitOps sealed secrets)
├── istio/                     # Istio service mesh configurations
│   ├── base/
│   │   ├── kustomization.yaml
│   │   ├── gateway.yaml
│   │   ├── virtual-service.yaml
│   │   ├── destination-rule.yaml
│   │   └── peer-authentication.yaml
│   └── overlays/
│       ├── dev/
│       │   ├── kustomization.yaml
│       │   └── virtual-service-patch.yaml
│       └── prod/
│           ├── kustomization.yaml
│           ├── authorization-policy.yaml
│           └── rate-limit-config.yaml
├── monitoring/                # Observability stack
│   ├── base/
│   │   ├── kustomization.yaml
│   │   ├── prometheus-servicemonitor.yaml
│   │   └── grafana-dashboards-configmap.yaml
│   └── overlays/
│       ├── dev/
│       │   └── kustomization.yaml
│       └── prod/
│           ├── kustomization.yaml
│           └── alerting-rules.yaml
├── operators/                 # Operator subscriptions and configs
│   ├── service-mesh-operator.yaml
│   ├── prometheus-operator.yaml
│   └── cert-manager-operator.yaml
└── examples/                  # Client implementation examples
    ├── python/                # Python client examples
    ├── nodejs/                # Node.js client examples
    └── curl/                  # cURL command examples
```

## Key Technologies

- **Platform**: OpenShift 4.x (Enterprise Kubernetes)
- **Service Mesh**: Istio for traffic management, security, and observability
- **API Gateway**: Envoy proxy (via Istio) for request routing and filtering
- **Monitoring**: Prometheus for metrics, Grafana for visualization
- **Security**: OAuth2/OIDC integration, mTLS between services
- **AI/ML**: Gateway for LLM providers (OpenAI, Anthropic, etc.)

## Common Commands

### Kustomize Build and Deploy
```bash
# Build and view manifests for dev environment
oc kustomize manifests/overlays/dev

# Build and view manifests for prod environment
oc kustomize manifests/overlays/prod

# Deploy to development environment
oc apply -k manifests/overlays/dev
oc apply -k istio/overlays/dev
oc apply -k monitoring/overlays/dev

# Deploy to production environment
oc apply -k manifests/overlays/prod
oc apply -k istio/overlays/prod
oc apply -k monitoring/overlays/prod

# Dry-run deployment to validate
oc apply -k manifests/overlays/dev --dry-run=client

# Delete resources using Kustomize
oc delete -k manifests/overlays/dev
```

### Environment Management
```bash
# Switch between environments
oc project ai-gateway-dev
oc project ai-gateway-prod

# Compare environments
diff <(oc kustomize manifests/overlays/dev) <(oc kustomize manifests/overlays/prod)

# Check current namespace
oc config current-context
```

### OpenShift/Kubernetes Operations
```bash
# Check deployment status
oc get pods -n ai-gateway-dev
oc get pods -n ai-gateway-prod

# View logs
oc logs -f deployment/ai-gateway -n ai-gateway-dev
oc logs -f deployment/ai-gateway -n ai-gateway-prod

# Scale deployment manually (dev only, prod uses HPA)
oc scale deployment/ai-gateway --replicas=3 -n ai-gateway-dev

# Check routes
oc get routes -n ai-gateway-dev
oc get routes -n ai-gateway-prod

# Access OpenShift console
oc console
```

### Istio Service Mesh
```bash
# Apply Istio configurations with Kustomize
oc apply -k istio/overlays/dev
oc apply -k istio/overlays/prod

# Check Istio injection
oc get namespace ai-gateway-dev -o jsonpath='{.metadata.labels}'
oc get namespace ai-gateway-prod -o jsonpath='{.metadata.labels}'

# View Istio metrics
istioctl dashboard grafana

# Check mTLS status
istioctl authn tls-check -n ai-gateway-prod

# Analyze Istio configuration
istioctl analyze -k istio/overlays/prod
```

### Development Workflow
```bash
# Validate all Kustomize overlays
for env in dev prod; do
  echo "Validating $env environment"
  oc apply -k manifests/overlays/$env --dry-run=client
  oc apply -k istio/overlays/$env --dry-run=client
  oc apply -k monitoring/overlays/$env --dry-run=client
done

# Run security scans on built manifests
oc kustomize manifests/overlays/prod | oc-compliance check-manifests -

# Test Istio policies locally
istioctl analyze <(oc kustomize istio/overlays/prod)

# Generate manifests for GitOps
oc kustomize manifests/overlays/prod > gitops/prod/ai-gateway.yaml
```

## Architecture Overview

### Multi-Tenant Design
- Each tenant gets isolated namespace with network policies
- Istio AuthorizationPolicy enforces tenant isolation
- Rate limiting per tenant using Envoy filters
- Separate service accounts and RBAC per tenant

### Security Architecture
- All external traffic flows through Istio ingress gateway
- mTLS enforced for all service-to-service communication
- OAuth2 proxy integration for user authentication
- API key validation for programmatic access
- Request/response filtering for PII and sensitive data

### High Availability
- Multi-zone deployment across OpenShift nodes
- Horizontal pod autoscaling based on request rate
- Circuit breaking and retry logic in Istio
- Health checks and readiness probes
- Persistent volume claims for state management

### Observability Stack
- Prometheus metrics exported from all components
- Custom Grafana dashboards for AI metrics (tokens, latency, errors)
- Distributed tracing with Jaeger
- Structured logging with OpenShift EFK stack
- SLO monitoring and alerting

## Key Implementation Patterns

### Gateway Request Flow
1. Request enters through OpenShift Route → Istio Ingress Gateway
2. JWT validation and rate limiting at gateway
3. Routing to appropriate backend based on model selection
4. Request transformation and enrichment
5. Backend AI provider call with timeout and retry
6. Response caching and filtering
7. Metrics and logging throughout pipeline

### Configuration Management
- Use Kustomize for environment-specific configurations
- ConfigMaps for non-sensitive configuration
- Secrets for API keys and credentials (encrypted at rest)
- GitOps workflow with ArgoCD or OpenShift GitOps

### Testing Strategy
- Unit tests for custom operators and controllers
- Integration tests using Kind or OpenShift Local
- Load testing with K6 or Locust
- Chaos engineering with Litmus
- Security scanning with Trivy and OWASP ZAP

## Important Considerations

### OpenShift Specifics
- Use SecurityContextConstraints (SCC) appropriately
- Leverage OpenShift Routes for ingress (in addition to Istio)
- Integrate with OpenShift OAuth for SSO
- Use OpenShift Pipelines (Tekton) for CI/CD
- Follow OpenShift resource quota and limit ranges

### Istio Best Practices
- Keep Istio version aligned with OpenShift Service Mesh
- Use destination rules for connection pooling
- Implement proper circuit breaker configurations
- Monitor Envoy proxy memory usage
- Use Istio telemetry v2 for performance

### AI Gateway Specifics
- Implement request queuing for rate-limited APIs
- Cache responses where appropriate (with TTL)
- Stream responses for large language model outputs
- Track token usage for cost allocation
- Implement fallback strategies for provider outages