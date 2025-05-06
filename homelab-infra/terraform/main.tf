resource "proxmox_vm_qemu" "k3s_master" {
  name        = "k3s-master"
  target_node = "proxmox"
  clone       = "ubuntu-2204-template"

  os_type = "cloud-init"
  cores   = 2
  memory  = 4096
  sockets = 1

  disk {
    size = "20G"
    type = "scsi"
    storage = "local-lvm"
  }

  network {
    model = "virtio"
    bridge = "vmbr0"
  }

  ipconfig0 = "ip=10.20.20.25/24,gw=10.20.20.1"

  sshkeys = file("~/.ssh/id_rsa.pub")
}