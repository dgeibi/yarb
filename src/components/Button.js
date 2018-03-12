import { css } from 'emotion'
import React from 'react'

const style = css`
  display: inline-block;
  color: orange;
  border: 1px solid;
  font: inherit;
  padding: 0.3em 0.4em;
  background-color: #fff;
  border-radius: 0.2em;
  cursor: pointer;
  text-decoration: none !important;
  &:disabled,
  &.disabled {
    color: #ddd;
    cursor: not-allowed;
  }
  & a {
    color: currentColor;
    text-decoration: none;
  }
  &:focus:not(.disabled) {
    outline: 0;
    color: red;
  }
`

export default function Button({ onClick, className, ...props }) {
  if (typeof props.href === 'string') {
    const disabledClass = props.disabled ? 'disabled' : ''
    return (
      <a
        {...props}
        onClick={e => {
          if (typeof onClick === 'function') onClick(e)
          if (props.disabled) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        css={style}
        className={className ? `${className} ${disabledClass}` : disabledClass}
      />
    )
  }
  return (
    <button
      css={style}
      type="button"
      className={className}
      onClick={onClick}
      {...props}
    />
  )
}
