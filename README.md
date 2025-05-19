# HomeLab Automation Project

## Physical Infrastructure

My homelab utilises a pfsense router which serves as a dhcp server, dns resolver and firewall, with one of it's interfaces dedicated to a Proxmox Server, which is where all the below fun stuff takes place. I'll pop an infrastructure diagram below, soon.

### Networking

#### Useful Commands

```
kubectl label node $NODE_NAME key=value
kubectl label node $NODE_NAME key- # this will remove the label
kubectl get nodes --show-labels

kubectl logs -n kube-system deployment/traefik
kubectl rollout restart deployment/traefik -n kube-system
kubectl rollout restart deployment controller -n metallb-system # above two are useful if ip address not changing
```

### Flux CD

I'm using Flux for two purposes:

1. Have it monitor any manifest changes inside of my repository and subsequently update my k3s cluster.
2. The other is to monitor my github packages and apply relevant new image upon creation (built via github actions + Dockerfile)

#### Super useful flux commands (troubleshooting)

```
kubectl logs -n flux-system deployment/kustomize-controller # deployment here refers to the kubernetes resource (deployments manage pods - so this is really pod logs)
flux get source git flux-system # Will show the last commit - which you can compare against your git logs
flux reconcile kustomization metallb --with-source # force reconcile if it hasn't picked up the changes - shouldn't need this though.
kubectl delete kustomization metallb-system -n flux-system # apparently you can delete and recreate if you really run into issues.
```

#### Other Flux Related Info

- There are two types of kustomizations: 1. Used to specify the location of a 'repo' (e.g., your files related to metallb) - this is usually located in the flux-system folder. 2. the one that specifes your resources (e.g., metallb/base -> ip-address-pool.yaml)
- I didn't end up needing it but the way to add a node label to a particularly node (vm) is to run something like the following: `kubectl label node hostname key=value` - I thought that i may need to limit the 'speaker' advertisements to certain nodes, but this wasn't necessary.

### MetalLB

In a cloud environment when load balancers are utilised an external IP is automatically allocated, however this isn't the case when using kubernetes locally. MetalLB essentially provides your load balancer with an external IP (external to your cluster that is).

#### Setup

As I'm using a GitOps approach, I wanted to be able to push up my changes (manifests) and have Flux CD automatically apply them locally.

1. Although I installed the metallb directly on my primary server node in future I would place this inside of my metallb kustomization -> see resources -> commented out link.
2. Create a Kustomization inside of flux-system which identifes the location of metallb files withing your repo (e.g., clusters/homelab/metallb/base)
3. In the location specified create your ip-address-pool and l2advertisement (unless you want to go with BGP) and create a Kustomization that idenfies your resources (e.g., ip-address-pool.yaml)

If you plan on setting it up as I've done, I think you're better of setting up Flux CD first, then it all feels quite seemless.

As a result, you should now have an external (to cluster) ip address associated with any load balancer services (e.g., Traefik)

_NOTE_: A if multiple control nodes are present, I believe that a speaker daemonSet is used, meaning that each node has a speaker - which is ready to advertise the address pool. However, if you want to to limit the 'speaking' to only certain nodes for instance you can by updating the DaemonSet manifest with the nodeSelector.

#### Useful Commands

```
kubectl logs -n metallb-system -l app=metallb,component=speaker
arping -I eth0 $VIP # Needs to be run from within same subnet
```

### Ansible

Whilst I was learning some of the technologies, I found it was often easier to just destroy and recreate my vms - when I encountered a major issue. After this was done using Terraform I could then reprovision my nodes quickly using ansible.

I did learn that this was more useful to do this after manually going through the process. This served as a way to solidify my understanding (both ansible and the relevant technology) and also provide a quick way to iterate over issues (should a reprovision be required).

Ansible can be installed easily installed on macOS with brew: `brew install ansible`, I also installed `brew install ansible-lint` for playbooks. Check that it has installed correctly with `ansible --version`

#### Key points

Ansible has a number of key concepts (I'm still a novice, btw):

1. Inventory: You require an inventory so that ansible knows how to connect with your with your hosts (see [here](./homelab-infra/ansible/inventory/hosts.yaml))
   - This resource is good for showing you how to test your connectivity to your hosts and describing how to create your hosts.yaml or ini file: [resource](https://docs.ansible.com/ansible/latest/getting_started/get_started_inventory.html)
2. Plays and Playbooks: Ansible has numerous _modules_ (which are often similar to linux commands, kind of) which can be used inside of your playbooks, to declaratively allow you to specify certain parameters and tasks that should be performed sequentially. See [here](./homelab-infra/ansible/playbooks/1-base-setup.yaml).
3. Templates and Vars also allow you to reduce code duplication and hard coded values. Vaults are a special case of variables which allow you to specify a _secret_. For instance, for [this](./homelab-infra/ansible/playbooks/5-flux-gitops-setup.yaml) playbook I used the vault to store my github_token - which was required for flux to connect with my repo (and make changes).

   - ```
     ansible-vault create /path/to/vault.yml
     ansible-vault view /path/to/vault.yml
     ansible-vault edit /path/to/vault.yml
     ansible-playbook /path/to/playbook.yaml --ask-vault-pass
     ```

   ```

   ```

#### Useful Ansible commands

```
ansible-playbook -vvv your_playbook.yml # verbosity - 1-3
```

### Kube-VIP

For my use case, I really was modelling what I believe is best practice and with a view to hosting my own sites externally. I believe the idea is that the Control Plane nodes (in my case 3 server nodes) provide redundancies for the agents. So, if one of the server nodes goes down another one will be used (by the agents). In terms of VIP this means that a Virtual IP is created and is used by the agents to connect to their _Master_.

### My Curiosities (Understanding + Confidence)

- In Flux, what exactly are patches and what is their relationship with the related manifests?
- What command allows me to view - verify - that kube-vip election leader change is taking place.
