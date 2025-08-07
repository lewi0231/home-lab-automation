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

export type SocialLink = {
  label: string
  link: string
  iconPath?: string
  iconName?: string
}

export type SocialMediaLinks = {
  email: SocialLink
  youtube: SocialLink
  facebook: SocialLink
  instagram: SocialLink
}

export const PROJECTS: Project[] = [
  // {
  //   name: 'Work Rate Calculator',
  //   description:
  //     'Built and hosted for UniPhi Car Detailing.  Provides a simple way of calculating relative percentages based on start time and speed.',
  //   link: 'https://work-rate-calculator.flowerhead.dev',
  //   video:
  //     'https://res.cloudinary.com/dhm2m3rx8/video/upload/q_auto,f_auto/workRateCalculatorRecording_jek2q8.mov',
  //   id: '1',
  // },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  // {
  //   company: 'Fivecast',
  //   title: 'Graduate Software Developer',
  //   start: '2022',
  //   end: '2024',
  //   link: 'https://trailwisdom.xyz',
  //   id: 'work1',
  // },
]

// Object structure for easy access by type
export const SOCIAL_MEDIA: SocialMediaLinks = {
  email: {
    label: 'Email',
    link: 'mailto:tofaco.car23@gmail.com',
  },
  youtube: {
    label: 'YouTube',
    link: 'https://www.youtube.com/channel/UCqe0n9hWtewTojEPg7WyRaQ',
    iconPath: '/youtube.svg',
  },
  facebook: {
    label: 'Facebook',
    link: 'https://www.facebook.com/profile.php?id=61579022346377',
    iconPath: '/facebook.svg',
  },
  instagram: {
    label: 'Instagram',
    link: 'https://www.instagram.com/tofaco/',
    iconPath: '/instagram.svg',
  },
} as const

export const EMAIL = 'tofaco.car23@gmail.com'
