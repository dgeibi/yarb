import { css, cx } from 'emotion'
import React from 'react'
import { Link } from 'react-router-dom'

const style = css`
  display: inline-block;
  color: orange;
  border: 1px solid;
  font: inherit;
  padding: 0.3em 0.4em;
  background-color: #fff;
  border-radius: 0.2em;
  text-decoration: none;
  &:disabled,
  &[aria-disabled='true'] {
    color: #ddd;
    pointer-events: none;
  }
  & a {
    color: currentColor;
    text-decoration: none;
  }
  &:focus {
    outline: 0;
  }
  &:focus:not([aria-disabled='true']) {
    color: red;
  }
`

export function LinkButton({ className, disabled, ...props }) {
  const newProps = {
    ...props,
    className: cx(style, className),
    ...(disabled && { tabIndex: -1, 'aria-disabled': 'true' }),
  }
  if (typeof props.to === 'string') {
    return <Link {...newProps} />
  }
  return (
    <a
      {...newProps}
      href={props.href || 'javascript:void(0)'} // eslint-disable-line no-script-url
      onClick={e => {
        if (typeof props.onClick === 'function') props.onClick(e)
        if (props.disabled) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    />
  )
}

export default LinkButton
