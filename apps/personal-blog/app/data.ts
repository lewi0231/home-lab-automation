type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Trailwisdom Travel Blog',
    description: 'Used Nexjs, Tailwind + Sanity.io',
    link: 'https://trailwisdom.xyz/',
    video: '/trailwisdom.mov',
    id: 'project1',
  },
  {
    name: 'Trailwisdom Travel Blog',
    description: 'Used Nexjs, Tailwind + Sanity.io',
    link: 'https://trailwisdom.xyz/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Fivecast',
    title: 'Graduate Software Developer',
    start: '2022',
    end: '2024',
    link: 'https://trailwisdom.xyz',
    id: 'work1',
  },
  {
    company: 'Intellilearn',
    title: 'Programmer / Data Entry',
    start: '2021',
    end: '2022',
    link: 'https://trailwisdom.xyz',
    id: 'work2',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Homelab Backup Strategy: From VM Snapshots to Application Data',
    description:
      'A comprehensive guide to developing a backup strategy for Proxmox + K3s homelab setups, covering VM backups, application data, and practical implementation. ',
    link: '/blog/homelab-backup-strategy',
    uid: 'homelab-backup-strategy',
  },
  {
    title: 'Homelab Resource Optimization: Making the Most of Limited Hardware',
    description:
      'How to optimize Kubernetes resource usage on limited hardware, including reducing cluster size, optimizing Flux controllers, and tuning monitoring stacks.',
    link: '/blog/kubernetes-resource-optimization',
    uid: 'kubernetes-resource-optimization',
  },
  {
    title:
      'Kubernetes Storage: Understanding PVs, PVCs, and When to Use StatefulSets vs Deployments',
    description:
      'A deep dive into Kubernetes storage concepts, troubleshooting persistent volume issues, and understanding when to use StatefulSets vs Deployments.',
    link: '/blog/kubernetes-storage-explained',
    uid: 'kubernetes-storage-explained',
  },
  {
    title: 'Why I Ditched Longhorn for Local-Path in My Homelab',
    description:
      'The story of migrating from Longhorn distributed storage to local-path provisioner in a resource-constrained homelab environment.',
    link: '/blog/ditching-longhorn-for-local-path',
    uid: 'ditching-longhorn-for-local-path',
  },
  {
    title: 'How to host your own website',
    description:
      'A complete guide to hosting websites using Kubernetes, MetalLB, Traefik, and Cloudflare Tunnel for secure, self-hosted web applications.',
    link: '/blog/host-your-websites',
    uid: 'host-your-websites',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/lewi0231',
  },
  {
    label: 'Email',
    link: 'mailto:flowerhead.dev@gmail.com',
  },
  // {
  //   label: 'Twitter',
  //   link: 'https://twitter.com/',
  // },
  // {
  //   label: 'Instagram',
  //   link: 'https://www.instagram.com/',
  // },
]

export const EMAIL = 'paul.richard.lewis.esq@gmail.com'
