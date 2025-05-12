## JUST NOTES AT THIS STAGE

- look at setting up a monorepo tool to share node_modules (turborepo, nx, pnpm workspaces, yarn workspace)
- Setup kubeconfig on local machine - this requires that you copy the `/etc/rancher/k3s/k3s.yaml` from master machine to your local machine and `export KUBECONFIG=path/to/file`

## Flux Installation Notes

I'm using Flux for two purposes:

1. Have it monitor any manifest changes inside of my repository and subsequently update my k3s cluster.
2. The other is so that when changes are made to my applications they are rebuilt using a Dockerfile (the image) which is then picked up and applied by flux CD.
