resource "proxmox_vm_qemu" "k3s_master" {
    name        = "k3s-master-chimera"
    desc = "My master node"
    target_node = var.proxmox_node
    # pool = "pool0"
    clone       = var.cloud_init_template
    os_type = "cloud-init"
    agent = 1 # QEMU agent - adds extra functionality
    cores = var.core_count
    sockets = 1
    cpu_type = var.cpu_type
    memory = var.memory_count
    balloon = var.memory_count
    scsihw = "virtio-scsi-single"
    bios = "seabios"
    disks {
        ide {
            ide0 {
                cloudinit {
                    storage = var.disk_storage
                }
            }
            ide2 {
                cdrom {
                }
            }
        }
        scsi {
            scsi0 {
                disk {
                    size            = var.disk_size
                    cache           = "writeback"
                    storage         = var.disk_storage
                    iothread        = true
                    discard         = true
                    emulatessd = true
                }
            }
        }
    }
    serial {
        id = 0
        type = "socket"
    }
    network {
        id = 0
        model = "virtio"
        bridge = "vmbr0"
        # tag = 256 - this is for vlan tagging
    }
    lifecycle {
      ignore_changes = [ network, ]
    }
    boot = "order=scsi0"
    ipconfig0 = "ip=10.20.20.25/24,gw=10.20.20.1"
    sshkeys = file("~/.ssh/id_rsa.pub")
    ciuser = var.ci_user
    cipassword = var.ci_password
}

resource "proxmox_vm_qemu" "k3s_worker" {
    name        = "k3s-worker-centaur"
    desc = "My master node"
    target_node = var.proxmox_node
    # pool = "pool0"
    clone       = var.cloud_init_template
    agent = 1
    os_type = "cloud-init"
    cores = var.core_count
    sockets = 1
    cpu_type = var.cpu_type
    memory = var.memory_count
    balloon = var.memory_count
    scsihw = "virtio-scsi-single"
    bios = "seabios"
    disks {
        ide {
            ide0 {
                cloudinit {
                    storage = var.disk_storage
                }
            }
            ide2 {
                cdrom {
                }
            }
        }
        scsi {
            scsi0 {
                disk {
                    size            = var.disk_size
                    cache           = "writeback"
                    storage         = var.disk_storage
                    iothread        = true
                    discard         = true
                    emulatessd = true
                }
            }
        }
    }
    serial {
        id = 0
        type = "socket"
    }
    network {
        id = 0
        model = "virtio"
        bridge = "vmbr0"
        # tag = 256
    }
    lifecycle {
        ignore_changes = [ network, ]
    }
    boot = "order=scsi0"
    ipconfig0 = "ip=10.20.20.26/24,gw=10.20.20.1"
    sshkeys = file("~/.ssh/id_rsa.pub")
    ciuser = var.ci_user
    cipassword = var.ci_password
}