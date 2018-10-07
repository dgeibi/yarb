import React from 'react'

const LOADING = 0
const RESOLVED = 1
const REJECTED = 2

function FallbackLoading({ error }) {
  if (error) {
    return (
      <div>
        Error!
        <pre>{error.stack}</pre>
      </div>
    )
  }
  return <div>Loading...</div>
}

export default function loadable(loader, { loading, render } = {}) {
  const Loading = typeof loading === 'function' ? loading : FallbackLoading
  let promise
  return class Loadable extends React.Component {
    state = {
      status: LOADING,
      component: null,
      error: null,
    }

    componentDidMount() {
      this.mounted = true
      if (this.state.status !== LOADING) return
      ;(promise = promise || loader())
        .then(module => {
          if (!this.mounted) return
          const component = module.default || module
          this.setState({
            component,
            status: RESOLVED,
          })
        })
        .catch(err => {
          if (!this.mounted) return
          this.setState({
            error: err,
            status: REJECTED,
          })
        })
    }

    componentWillUnmount() {
      this.mounted = false
    }

    render() {
      const { status, error, component } = this.state
      if (status === LOADING) {
        return <Loading />
      } else if (status === REJECTED) {
        return <Loading error={error} />
      }
      if (typeof render === 'function') {
        return render({ component })
      }
      return React.createElement(component)
    }
  }
}
