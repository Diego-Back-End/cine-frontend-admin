import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react'
import { isAuthConfigured, initializeMsal } from './auth/msalConfig'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))

async function bootstrap() {
  if (!isAuthConfigured) {
    root.render(
      <StrictMode>
        <main className="flex min-h-screen items-center justify-center bg-base-200 p-4">
          <div className="alert alert-error max-w-md">
            <span>
              Configuración incompleta. Copia .env.example a .env y reemplaza
              VITE_AZURE_CLIENT_ID y VITE_AZURE_AUTHORITY con los valores del
              App Registration en Azure Entra ID.
            </span>
          </div>
        </main>
      </StrictMode>,
    )
    return
  }

  const msalInstance = await initializeMsal()
  await msalInstance.handleRedirectPromise()

  root.render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>,
  )
}

bootstrap()
