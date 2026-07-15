import React, { type ErrorInfo, type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import logger from '../services/logging'

interface ErrorBoundaryProps { children?: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.warn('Error capturado por ErrorBoundary: ' + error.message)
    logger.debug('Detalles del error: ' + info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-2xl font-bold"><FormattedMessage id="error.boundary.title" /></h1>
          <p className="mt-3"><FormattedMessage id="error.boundary.message" /></p>
          <button className="button-primary mt-6" onClick={() => window.location.reload()}>
            <FormattedMessage id="error.boundary.reload" />
          </button>
        </main>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
