# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an enterprise-grade AI gateway designed for OpenShift environments with a focus on security, multi-tenancy, and production readiness. The project aims to provide secure, managed access to AI/ML models (particularly LLMs) in financial services contexts.

## Project Structure

The intended directory structure is:
```
openshift-ai-gateway/
├── README.md                  # Project overview and architecture diagrams
├── docs/                      # Detailed setup and API documentation
├── manifests/                 # Kubernetes/OpenShift YAML files
│   ├── base/                  # Base Kustomization files
│   ├── overlays/              # Environment-specific overlays
│   └── crds/                  # Custom Resource Definitions
├── istio-config/              # Istio service mesh configurations
│   ├── virtual-services/      # Traffic routing rules
│   ├── destination-rules/     # Load balancing and circuit breaking
│   └── security/              # mTLS and authorization policies
├── monitoring/                # Observability stack
│   ├── prometheus/            # Metrics collection
│   └── grafana/               # Dashboards
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

### OpenShift/Kubernetes Operations
```bash
# Deploy to development environment
oc apply -k manifests/overlays/dev

# Deploy to production
oc apply -k manifests/overlays/prod

# Check deployment status
oc get pods -n ai-gateway

# View logs
oc logs -f deployment/ai-gateway -n ai-gateway

# Access OpenShift console
oc console
```

### Istio Service Mesh
```bash
# Apply Istio configurations
oc apply -f istio-config/ -n ai-gateway

# Check Istio injection
oc get namespace ai-gateway -o jsonpath='{.metadata.labels}'

# View Istio metrics
istioctl dashboard grafana

# Check mTLS status
istioctl authn tls-check
```

### Development Workflow
```bash
# Validate Kubernetes manifests
oc apply --dry-run=client -f manifests/

# Run security scans on manifests
oc-compliance check-manifests manifests/

# Test Istio policies locally
istioctl analyze -f istio-config/
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