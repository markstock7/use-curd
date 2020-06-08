import React, {
  Component,
  Suspense as ReactSuspense,
  SuspenseProps
} from 'react'

interface SuspenseState {
  error: Error | null
}

export class ErrorBoundary extends Component<any, SuspenseState> {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  public componentDidCatch(error) {
    // @todo only process resource error
  }
  static getDerivedStateFromError(error) {
    return { error }
  }

  public render() {
    if (this.state.error) {
      return <h1>{this.state.error.message}.</h1>
    }
    return this.props.children
  }
}

class Suspense extends Component<SuspenseProps> {
  public render() {
    return (
      <ReactSuspense fallback={this.props.fallback}>
        <ErrorBoundary>{this.props.children}</ErrorBoundary>
      </ReactSuspense>
    )
  }
}

export default Suspense
