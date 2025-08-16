# Homelab Infrastructure Setup Guide

This guide documents the setup process for a Kubernetes homelab with end-to-end encryption using cert-manager and Cloudflare tunnels.

## Overview

The infrastructure consists of:

- **Traefik** as the ingress controller (public and private instances)
- **cert-manager** for SSL certificate management
- **Cloudflare tunnels** for secure external access
- **Sealed Secrets** for encrypted secret storage

## Prerequisites

- Kubernetes cluster with MetalLB configured
- Cloudflare account with domain management
- Helm installed and configured
- kubectl configured for your cluster

## Installation Steps

### 1. Install Traefik Ingress Controller

Install Traefik using Helm with separate public and private instances:

```bash
# Add Traefik Helm repository
helm repo add traefik https://helm.traefik.io/traefik
helm repo update

# Install public Traefik instance
helm install --namespace traefik-public --create-namespace traefik-public traefik/traefik \
  --values ../../clusters/homelab/infrastructure/traefik/traefik-public-values.yaml

# Install private Traefik instance (optional)
helm install --namespace traefik-private --create-namespace traefik-private traefik/traefik \
  --values ../../clusters/homelab/infrastructure/traefik/traefik-private-values.yaml
```

**Key Configuration Points:**

- Set `service.spec.loadBalancerIP` to an IP within your MetalLB range
- Configure `providers.kubernetesCRD.ingressClass` for your specific ingress class
- Public and private instances allow separate traffic management

### 2. Install cert-manager

Install cert-manager for automated SSL certificate management:

```bash
# Add cert-manager Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --values ../../clusters/homelab/infrastructure/helm/cert-manager-values.yaml
```

**Important Configuration:**

```yaml
extraArgs:
  - --dns01-recursive-nameservers-only
  - --dns01-recursive-nameservers=1.1.1.1:53,9.9.9.9:53
podDnsPolicy: None
podDnsConfig:
  nameservers:
    - "1.1.1.1"
    - "9.9.9.9"
crds:
  enabled: true # Let Helm manage CRDs
```

### 3. Configure ClusterIssuer

Create a ClusterIssuer for DNS-01 challenges with Cloudflare:

```yaml
# Key configuration for ClusterIssuer
spec:
  acme:
    email: your-email@example.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory # Use staging for testing
    privateKeySecretRef:
      name: cluster-issuer-staging
    solvers:
      - dns01:
          cloudflare:
            email: your-email@example.com
            apiTokenSecretRef:
              name: cloudflare-token-secret
              key: cloudflare-token
        selector:
          dnsZones:
            - "yourdomain.com"
```

**Note:** Use the staging server initially for testing, then switch to production.

### 4. Create Application Namespaces

Organize your applications into logical namespaces:

```bash
kubectl create namespace frontend
kubectl create namespace backend
kubectl create namespace databases
kubectl create namespace monitoring
```

### 5. Create SSL Certificates

Create certificates for each namespace that requires HTTPS:

```bash
# Example: Create certificate for frontend namespace
kubectl apply -f certificates/frontend-certificate.yaml
```

**Best Practice:** Create certificates per namespace for better isolation and management.

### 6. Set Up Cloudflare Tunnel

For secure external access with dynamic IP support:

**Option A: Manual Setup**

```bash
# Install cloudflared on master node
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install cloudflared

# Create tunnel
cloudflared tunnel login
cloudflared tunnel create my-tunnel

# Create Kubernetes secret
kubectl create secret generic tunnel-credentials \
  --from-file=credentials.json=.cloudflared/[tunnel-id].json

# Deploy cloudflared
kubectl apply -f cloudflared.yaml

# Configure DNS route
cloudflared tunnel route dns my-tunnel "your.domain.com"
```

**Option B: Automated Setup**
Use the provided automation script:

```bash
./cloudflare/scripts/cloudflare-tunnel.sh
```

See [Cloudflare Tunnel Script Documentation](./cloudflare/scripts/README.md) for detailed instructions.

## Important Configuration Notes

### Public vs Private Access

- **Public Traefik**: Configured to work with Cloudflare (no port 80 redirects)
- **Private Traefik**: Internal-only access for local services
- **Local Access**: Add hostname to private Traefik routes for local testing

### Security Considerations

- Use Cloudflare for TLS termination on public services
- Implement proper ingress rules and network policies
- Use Sealed Secrets for sensitive configuration storage

## Sealed Secrets Setup

Sealed Secrets provide encrypted secret storage for Git repositories.

### 1. Install Sealed Secrets Controller

```bash
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo update
helm install sealed-secrets-controller sealed-secrets/sealed-secrets \
  --namespace sealed-secrets \
  --create-namespace
```

### 2. Verify Installation

```bash
kubectl get pods -n sealed-secrets
```

### 3. Install kubeseal CLI

```bash
# macOS
brew install kubeseal

# Verify access to controller
kubeseal --fetch-cert \
  --controller-name=sealed-secrets-controller \
  --controller-namespace=sealed-secrets
```

### 4. Create Sealed Secrets

```bash
# Create sealed secret from existing secret
kubeseal --controller-name sealed-secrets-controller \
  --controller-namespace sealed-secrets \
  --format yaml < secret.yaml > sealed-secret.yaml

# Apply sealed secret and remove original
kubectl apply -f sealed-secret.yaml
kubectl delete secret original-secret-name
```

## Troubleshooting

### Common Issues

1. **Certificate Issues**: Check cert-manager logs and ClusterIssuer status
2. **Tunnel Problems**: Verify Cloudflare login and tunnel credentials
3. **Ingress Issues**: Check Traefik logs and ingress configurations

### Useful Commands

```bash
# Check certificate status
kubectl get certificates,certificaterequests

# View Traefik logs
kubectl logs -n traefik-public -l app.kubernetes.io/name=traefik

# Check tunnel status
cloudflared tunnel list

# Verify sealed secrets
kubectl get sealedsecrets -A
```

## Next Steps

1. Configure monitoring and logging
2. Set up backup solutions
3. Implement proper network policies
4. Configure automated certificate renewal monitoring

## Traefik Dashboard

If you're wanting to create a secret for your dashboard you'll need to do the following - this is referenced in the ingressroute middleware.

**Important:** The secret must contain a single `users` field, not separate `username` and `password` fields. The value should be in the format `username:hashedpassword`, where `hashedpassword` is generated using a tool like `htpasswd` or `openssl` (bcrypt or MD5 are supported by Traefik).

Example (using htpasswd):

```
htpasswd -nb admin yourpassword
```

Then create the secret:

```
kubectl create secret generic traefik-dashboard-auth --namespace monitoring --from-literal=users="admin:$apr1$YxDVI.U9$m3CoUe5SkOipPD68FRUSP1"
```

This secret will be referenced by the Traefik dashboard middleware for basic authentication. If you need to regenerate the secret for a new cluster, repeat the above steps.

## Monitoring

### Grafana

Grafana is used for monitoring. To install, use the instructions setout at arifacthub: `https://artifacthub.io/packages/helm/grafana/grafana`

#### Get Password (for user admin)

To obtain the automatically generated password, run this:
`kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`

Apparently this is the url - `grafana.monitoring.svc.cluster.local` - however i haven't yet set up the ability to access this. My thinking is that i'll create an ingress to access it.

### Alloy

### Loki

Again you can following the helm install info here:
`https://artifacthub.io/packages/helm/grafana/loki`

**IMPORTANT**: You'll need to run it as a SingleBinary (with replicas = 1, ensure read, write and backend are all set to 0 - as it's single binary, also replication_factor should also be 1, useTestSchema = True, and Storage.type = filesystem and storageClass = longhorn (if that is what i'm using))

### Prometheus

Head [here](https://artifacthub.io/packages/helm/prometheus-community/prometheus) for install instructions and default values.

#### After Installation Info

`
The Prometheus server can be accessed via port 80 on the following DNS name from within your cluster:
prometheus-server.monitoring.svc.cluster.local

Get the Prometheus server URL by running these commands in the same shell:
export POD_NAME=$(kubectl get pods --namespace monitoring -l "app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace monitoring port-forward $POD_NAME 9090

The Prometheus alertmanager can be accessed via port 9093 on the following DNS name from within your cluster:
prometheus-alertmanager.monitoring.svc.cluster.local

Get the Alertmanager URL by running these commands in the same shell:
export POD_NAME=$(kubectl get pods --namespace monitoring -l "app.kubernetes.io/name=alertmanager,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace monitoring port-forward $POD_NAME 9093
#################################################################################

###### WARNING: Pod Security Policy has been disabled by default since

###### it deprecated after k8s 1.25+. use

###### (index .Values "prometheus-node-exporter" "rbac"

###### . "pspEnabled") with (index .Values

###### "prometheus-node-exporter" "rbac" "pspAnnotations")

###### in case you still need it.

#################################################################################

The Prometheus PushGateway can be accessed via port 9091 on the following DNS name from within your cluster:
prometheus-prometheus-pushgateway.monitoring.svc.cluster.local

Get the PushGateway URL by running these commands in the same shell:
export POD_NAME=$(kubectl get pods --namespace monitoring -l "app=prometheus-pushgateway,component=pushgateway" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace monitoring port-forward $POD_NAME 9091

For more information on running Prometheus, visit:
https://prometheus.io/
`

## HOSTING GITHUB actions runner

I'm hosting a github actions runner on my homelab. I'm using the following helm chart: `https://artifacthub.io/packages/helm/actions-runner-controller/actions-runner-controller`

NOTES:

1. Get the application URL by running these commands:
   export POD_NAME=$(kubectl get pods --namespace actions -l "app.kubernetes.io/name=actions-runner-controller,app.kubernetes.io/instance=actions-runner-controller" -o jsonpath="{.items[0].metadata.name}")
  export CONTAINER_PORT=$(kubectl get pod --namespace actions $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace actions port-forward $POD_NAME 8080:$CONTAINER_PORT
