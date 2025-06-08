## Install key services

I wanted end to end encryption which required that I use cert-manager for this. Below are the steps that I'm following to do this.

1. First install Traefik using helm:

```
    helm repo add traefik https://helm.traefik.io/traefik
    helm repo update
    helm install --namespace traefik-public --create-namespace traefik-public traefik/traefik --values ../../clusters/homelab/infrastructure/traefik/traefik-public-values.yaml
```

This adds the Trefik helm chart and updates it. Then installs it. **I've performed this twice - once with traefik-public and another time with traefik-private namespaces and actual name of the service**. This is because I plan to have two distinct LBs - one that is public facing and another which is internal only. Key values file info below:

```
service.spec.loadBalancerIP = {YOUR_IP} # Within metallb range
providers.kubernetesCRD.ingressClass = {YOUR_INGRESS_CLASS_NAME}
```

2. Cert-Manager installation:

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --values ../../clusters/homelab/infrastructure/helm/cert-manager-values.yaml
```

Key information inside of values file is:

```
extraArgs:
  - --dns01-recursive-nameservers-only
  - --dns01-recursive-nameservers=1.1.1.1:53,9.9.9.9:53
podDnsPolicy: None
podDnsConfig:
  nameservers:
    - "1.1.1.1"
    - "9.9.9.9"
```

I've also opted for `crds.enabled = true` also so that helm manages my crds for me.

3. The next step is to create the ClusterIssuer and the Secret (which contains the cloudflare api token). I've opted for a ClusterIssuer that is inside of the default ns.

```
# Key info from cluster issuer
spec:
  acme:
    email: paullewis1308@gmail.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: cluster-issuer-staging
    solvers:
      - dns01:
          cloudflare:
            email: paullewis1308@gmail.com
            apiTokenSecretRef:
              name: cloudflare-token-secret
              key: cloudflare-token
        selector:
          dnsZones:
            - "flowerhead.dev"
```

4. Determine which Traefik LB you want to assign to your deployment. For instance, you might run two instances of nginx (one private and one public). In this example I created a `frontend` namespace for my applications (private and public) and two different ingressroutes (for private and public). They both use the same key, but they each use the relevant Traefik LB.

```
# Possible namespaces to create
kubectl create namespace frontend
kubectl create namespace backend
kubectl create namespace databases
```

5. Create the Certificate. This needs to be in the namespace of the applications that are using it (e.g., frontend). It's better to use the letsencrypt staging server whilst you're working this out.

6. Create cloudflare tunnel for public facing application. This is because my ISP have a dynamic IP - but also more secure.

   1. Commands are as follow:

   ```
   # Adds and installs package - run from primary master node
   curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
   echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
   apt update && apt install cloudflared
   # Creates the tunnel and stores tunnel credentials
   cloudflared tunnel login
   cloudflared tunnel create my-tunnel
   kubectl create secret generic tunnel-credentials --from-file=credentials.json=.cloudflared/5623acb0-bf87-437a-9678-859b80abd1fb.json
   # Deploys cloudflared (tunnel endpoint) - run from wherever you have your cloudflared deployment manifest
   kubectl apply -f cloudflared.yaml
   cloudflared tunnel route dns my-tunnel "your.url" # This creates the actual route to your tunnel

   ```

7. Getting this to work privately and publicly.

#### Key points

- You'll need to ensure that in your public traefik load balancer it needs to forgo redirections from port 80. This is because Cloudflare is taking care of security (TLS) etc - and we don't need to use certificates on our end.
- If you want to access the public site locally - without going through cloudflare, you'll want to resolve the hostname to your private Traefik load balancer and add the hostname to the match list in routes (inside of your ingressroute).
