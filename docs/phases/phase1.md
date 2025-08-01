Phase 1 Goals (Week 1)

  Get a simple gateway running on OpenShift with basic Kustomize structure. No Istio yet - just OpenShift fundamentals.

  Step-by-Step Tasks:

  1. Create the Gateway Application (Day 1)

  - Build a simple Python/Go HTTP server in apps/gateway/
  - It should accept POST requests and forward to mock services
  - No authentication yet, just basic routing
  - Include health/ready endpoints for OpenShift probes

  2. Write Base Kubernetes Manifests (Day 2)

  In manifests/base/:
  - namespace.yaml - Create ai-chaos-lab namespace
  - deployment.yaml - Basic deployment with 2 replicas
  - service.yaml - ClusterIP service
  - configmap.yaml - Configuration for endpoints
  - kustomization.yaml - List all resources

  3. Create Environment Overlays (Day 3)

  - manifests/overlays/dev/ - 1 replica, debug logging
  - manifests/overlays/prod/ - 3 replicas, resource limits
  - Add OpenShift Route in each overlay
  - Practice patching with Kustomize

  4. Deploy to OpenShift (Day 4)

  # You'll run:
  oc apply -k manifests/overlays/dev
  oc get pods -n ai-chaos-lab
  oc logs -f deployment/gateway

  5. Add Mock Services (Day 5)

  - Create super simple mock-openai and mock-anthropic apps
  - Just return static JSON responses
  - Deploy them to same namespace
  - Update gateway ConfigMap with their service URLs

  What You'll Learn in Phase 1:

  - OpenShift project/namespace creation
  - Basic Kubernetes resources (Deployment, Service, ConfigMap)
  - Kustomize overlays and patching
  - OpenShift Routes vs Ingress
  - Container image building for OpenShift
  - Resource limits and requests
  - Health checks and probes
  - OpenShift CLI basics

  Success Criteria:

  curl https://gateway-dev.apps.your-cluster.com/api/v1/inference \
    -X POST \
    -d '{"model": "gpt-3.5", "prompt": "Hello"}'

  # Should return mock response

  Once Phase 1 works, Phase 2 adds Istio service mesh on top!