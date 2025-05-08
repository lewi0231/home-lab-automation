resource "proxmox_vm_qemu" "k3s_nodes" {
    count = 5
    name        = var.node_names[count.index]
    target_node = var.proxmox_node
    clone       = var.cloud_init_template
    os_type = "cloud-init"
    agent = 1 # QEMU agent enabled
    cores = var.core_count
    sockets = 1
    vcpus = 0
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
        macaddr = var.mac_addresses[count.index]
        firewall = true
    }
    ciupgrade = true
    boot = var.boot_from
    ipconfig0 = var.ip_config    
    sshkeys = file("~/.ssh/id_rsa.pub")
    ciuser = var.ci_user
    cipassword = var.ci_password
}
