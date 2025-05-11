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

## Cloud Image

There are a number of instructions online on how to create a cloud image. We need this so that our VM is preconfigured. For instance, see this [repo]('https://github.com/HouseOfLogicGH/ProxmoxPVE/blob/main/TerraformOpenTofuCloudInit/cloudinitsetuporacular.sh')

NOTE: I did encounter an issue when attempting to use the command `virt-customization` (which is part of the libguestsfs-tools package). The solution here is to disable the enterprise repositories here `/etc/apt/sources.list.d/pve-enterprise.listes` and here `/etc/apt/sources.list.d/ceph.list` and then add the no-subscription repo to main sources here `/etc/apt/sources.list` - adding the following line: deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription. This should allow you to successfully install the libguestsfs-tools package.
