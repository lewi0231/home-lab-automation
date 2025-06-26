## Reinstalling Flux

I already have the manifests, so rather than bootstrapping I can just install.

1. If you require flux to be installed on your system you can do so with:
   `curl -s https://fluxcd.io/install.sh | sudo bash`
2. `kubectl apply -f path/to/flux-system` - This should install all the relevent controllers.
3. Create a token in github and then create the secret here:
   ```
   flux create secret git flux-system \
   --url=https://github.com/your-username/your-repo.git \
   --username=your-username \
   --password=your-token
   ```
4. Run `flux get sources git -n flux-system` and if any problems you can force reconcile - `flux reconcile source git flux-system`
5. `flux get pods -n flux-system` should show all the working pods.
6. I also need a docker-registry secret for image update automation.

**NOTE**: You'll need to create the relevant Image Update Automation credential in the relevant namespace (e.g., development), with the following:

```bash
kubectl create secret docker-registry ghcr-credentials \
    --namespace=development \
    --docker-server=ghcr.io \
    --docker-username=$GITHUB_USER \
    --docker-password=$GITHUB_TOKEN
```
