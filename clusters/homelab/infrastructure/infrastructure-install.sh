!#/bin/bash

set -e

# Add helm repos to be used + update
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo add jetstack https://charts.jetstack.io
helm repo add traefik https://traefik.github.io/charts
helm repo add longhorn https://charts.longhorn.io
helm repo update

# 1. sealed-secret
helm install sealed-secrets-controller sealed-secrets/sealed-secrets \
  --namespace sealed-secrets \
  --create-namespace

# 2. cert-manager
helm upgrade --install cert-manager jetstack/cert-manager \
    --namespace cert-manager --create-namespace \
    -f ./cert-manager/helm/values.yaml

kubectl apply -f ./cert-manager/cluster-issuers/production.yaml -n cert-manager
kubectl apply -f ./cert-manager/secrets/sealed-cf-token-secret.yaml -n cert-manager


# 3. MetalLB 
# TODO - relocate metallb install here

# 4. Traefik (public and private)
kubectl create namespace traefik-private
kubectl apply -f ./traefik/internal/traefik-private-manifest.yaml -n traefik-private 

helm upgrade --install traefik-public traefik/traefik \
    --namespace traefik-public --create-namespace \
    -f ./traefik/external/values.yaml

# 5. Cloudflare tunnel (run script)
./cloudflare/scripts/cloudflare-tunnel.sh

# 6. Install longhorn
helm upgrade --install longhorn longhorn/longhorn \
  --namespace longhorn-system --create-namespace -f ./longhorn/values.yaml

# 7. Monitoring stack (Prometheus, Grafana, etc.)
# helm upgrade --install prometheus prometheus-community/kube-prometheus-stack ...



# 7. Pi-hole
# helm upgrade --install pihole mojo2600/pihole ...

# 8. Authentik
# helm upgrade --install authentik authentik/authentik ...

# 9. Middlewares (usually via kubectl apply -f ...)
# kubectl apply -f middlewares/

# 10. Testing tools
# kubectl apply -f testing/