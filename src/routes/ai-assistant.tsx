import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-assistant')({
  component: function AiAssistantPage() {
    return <div className="p-8 text-center text-zoopsy-dark-gray">AI-ассистент (в розробці)</div>
  },
})