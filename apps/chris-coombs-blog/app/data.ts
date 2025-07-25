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
  {
    company: 'Fivecast',
    title: 'Graduate Software Developer',
    start: '2022',
    end: '2024',
    link: 'https://trailwisdom.xyz',
    id: 'work1',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Email',
    link: 'mailto:tophcoombs@gmail.com',
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

export const EMAIL = 'tophcoombs@gmail.com'
