## Setup

### Terraform

1. Install - I'm using a mac.

```
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -v  # confirm install
```

### Ansible

At this point in time I'm in the process of getting to know Ansible. It seems quite understandable - requiring a hosts file and your playbooks (that essentially break what you want to do on each of your hosts into tasks).

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
