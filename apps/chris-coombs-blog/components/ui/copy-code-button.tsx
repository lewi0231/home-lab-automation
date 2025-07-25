import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

// Copy Code Button Component
export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-2 right-2 rounded-md p-2 text-gray-400 transition-colors hover:cursor-pointer hover:bg-gray-700 hover:text-white"
      title="Copy code"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}
