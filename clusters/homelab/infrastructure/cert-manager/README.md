# Cert Manager - Install Notes

No need to apply the Staging Cluster-Issuer - unless there is a problem.

## Cloudflare API Token

The cluster issuer relies on the:

```
    apiTokenSecretRef:
        name: cloudflare-token-secret
        key: cloudflare-token
```

I have a sealed secret in the cert-manager folder which can be used but if you need to create a new one - do the following:

1. Create a new API token for your domain under cloudflare profile.
2. ```
   kubectl create secret generic cloudflare-token-secret \
     --from-literal=cloudflare-token=YOUR_CLOUDFLARE_API_TOKEN \
     -n cert-manager
   ```
