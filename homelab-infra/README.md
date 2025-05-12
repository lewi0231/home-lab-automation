## Setup

### Infrastructure

I am using Proxmox on baremetal. A full infrastructure diagram to follow.

### Goal

My goal is to use Terraform and Ansible to automate the and record the process of configuring a HA homelab. I'm still learning about all the above - so generally it's a work in progress.

My aim was to utilise Kube-VIP to create a high availability cluster. That is enable fault tolerance for the Control Plan. Kube-vip creates a virtual ip that allows for the nodes to still be able to access the control plan when a node goes down. I've gone with a k3s cluster as this is lightweight - and as it stands i only have a single micro pc to run my vms off. More to come...

### Terraform

1. Terraform installation (mac)

```
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -v  # confirm install
```

2. See terraform directory for relevant files (e.g., main.tf). I'm using an ubuntu cloud init template to automatically create the number of VMs I desire. NOTE: I've manually set the mac address for each instance so that I can reserve an IP address for each VM.

### Ansible

My goal was to use Ansible

I'm moving towards replicating my other homeLab repo here - so that I get more familiar with automation. While I'm at it I intend to make my cluster HA.

## TODO

1. For real-world use:
   • Swap raw passwords with Terraform Cloud, .tfvars.json, or Vault
   • Use Proxmox API tokens instead of password auth if possible
2. How do i use api tokens instead of password auth? why is this better?
3. if you're wanting to add logs to your terraform export TF_LOG=TRACE
4. Check which nodes owns the vip (kube-vip) with `sudo arp -an | grep 10.20.20.99` - found that i can verify the kube-vip assignment is working by looking at the logs for one of the kube-vip pods: `sudo kubectl logs -n kube-system pod-name` -> this will show something like the below (somewhere in the logs):
   ```
   I0511 19:16:40.239520       1 leaderelection.go:257] attempting to acquire leader lease kube-system/plndr-cp-lock...
   2025/05/11 19:16:40 INFO new leader elected "new leader"=cerberus
   2025/05/11 19:16:40 INFO New leader leader=cerberus
   ```
5. Interesting bit of information is around the /32 mask. Kube-vip allocates the ip directly to the interface. By using the /32 subnet mask the network knows that this is a unique subnet with only one available address, so no need for ARP.
6. I'm using Ansible Vault for my github token - this requires that you run it differently - need to use the `--ask-vault-pass` flag when running your playbook.

## Cloud Image

There are a number of instructions online on how to create a cloud image. We need this so that our VM is preconfigured. For instance, see this [repo]('https://github.com/HouseOfLogicGH/ProxmoxPVE/blob/main/TerraformOpenTofuCloudInit/cloudinitsetuporacular.sh')

NOTE: I did encounter an issue when attempting to use the command `virt-customization` (which is part of the libguestsfs-tools package). The solution here is to disable the enterprise repositories here `/etc/apt/sources.list.d/pve-enterprise.listes` and here `/etc/apt/sources.list.d/ceph.list` and then add the no-subscription repo to main sources here `/etc/apt/sources.list` - adding the following line: deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription. This should allow you to successfully install the libguestsfs-tools package.
