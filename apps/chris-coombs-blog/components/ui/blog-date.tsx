interface BlogDateProps {
  date: string | Date
}

export function BlogDate({ date }: BlogDateProps) {
  const formatDate = (dateInput: string | Date) => {
    const dateObj =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <time className="text-sm text-gray-500 dark:text-gray-400">
      {formatDate(date)}
    </time>
  )
}
