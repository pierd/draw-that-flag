import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'
import { PostHogProvider } from 'posthog-js/react'

const options = {
  api_host: 'https://wieprz.lessismore.studio/eu',
  ui_host: 'https://eu.posthog.com',
  defaults: '2025-11-30',
} as const;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider apiKey="phc_aaF1FEvqBY5V6BPwhoIrWEZFjg8L5KZjqgTJw8eKd51" options={options}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
