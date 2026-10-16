import React from 'react'

export default class ErrorBoundary extends React.Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err, info) {
    console.error('ErrorBoundary:', err, info)
  }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 16, background: '#fff', minHeight: '100vh' }}>
          <h3 style={{ color: 'red', marginBottom: 8 }}>⛔ خطا</h3>
          <pre style={{
            padding: 12, background: '#fee', whiteSpace: 'pre-wrap',
            direction: 'ltr', textAlign: 'left', fontSize: 12,
            borderRadius: 8, overflow: 'auto', maxHeight: '80vh'
          }}>
            {String(this.state.err?.stack || this.state.err || 'unknown')}
          </pre>
          <button
            onClick={() => { this.setState({ err: null }) }}
            style={{ marginTop: 12, padding: 8, background: '#2E7D32', color: '#fff', border: 0, borderRadius: 8 }}
          >
            تلاش دوباره
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
