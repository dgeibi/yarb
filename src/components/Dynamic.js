import React from 'react'

const LOADING = 0
const RESOLVED = 1
const REJECTED = 2

export default class Dynamic extends React.Component {
  state = {
    status: LOADING,
    Component: null,
    error: null,
  }

  componentDidMount() {
    this.mounted = true
    this.props
      .import()
      .then(module => {
        if (!this.mounted) return
        const Component = module.default || module
        this.setState({
          Component,
          status: RESOLVED,
        })
      })
      .catch(err => {
        console.log(err)
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

  getElementFromProps(name, payload) {
    if (React.isValidElement(this.props[name])) {
      return this.props[name]
    }
    if (typeof this.props[name] === 'function') {
      const ret = this.props[name](payload)
      if (React.isValidElement(ret)) {
        return ret
      }
    }
    return null
  }

  render() {
    if (this.state.status === LOADING) {
      const ele = this.getElementFromProps('loadingFallback')
      if (ele) return ele
      return <div>loading...</div>
    } else if (this.state.status === REJECTED) {
      const ele = this.getElementFromProps('rejectFallback', {
        error: this.state.error,
      })
      if (ele) return ele
      return <div>failed</div>
    }
    const { Component } = this.state
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.Component)
    }
    return <Component />
  }
}
