import React, { Component } from 'react'
import './SelectInput.css'

import { TRACKED_KEYS, FORWARD_KEYS, BACKWARD_KEYS } from '../input-helpers'
import { moveForward, moveBackward, isObjectAltered, makeInputLabel, makeDisplayButton } from '../input-helpers'

const initializeState = props => {
  const { open, edit = false, value = '', } = { ...props }
  return {
    active: open || edit,
    value: value,
  }
}

export default class SelectInput extends Component {
  constructor(props) {
    super(props)
    this.state = initializeState(props)
  }
  pushOwnState = () => {
    const state = { ...this.state }
    const { passState, name } = { ...this.props }
    passState(name, state)
  }
  handleKeyDown = e => {
    const { which, target } = e
    if (!TRACKED_KEYS.includes(which)) return null
    e.preventDefault()
    if (which === 13) this.setValue(e)
    if (FORWARD_KEYS.includes(which)) moveForward(target)
    if (BACKWARD_KEYS.includes(which)) moveBackward(target)
  }
  handleToggle = e => {
    e.preventDefault()
    this.setState( ({ active }) => ({ active: !active }), this.pushOwnState )
  }
  setValue = e => {
    e.preventDefault()
    const { target } = { ...e }
    const { value } = target
    this.setState(prevState => ({
      value,
      active: !prevState.active,
    }), () => {
      moveForward(target)
      this.pushOwnState()
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { locked, forced } = nextProps
    const state = { ...this.state }
    if (forced) return true
    if (locked) return false
    const willUpdate = isObjectAltered(state, nextState)
    // if (willUpdate) console.log(`selectInput - ${ name } - updating`)
    //   else console.log(`selectInput - ${ name } - not updating`)
    return willUpdate
  }
  componentWillReceiveProps(nextProps) {
    const { edit, value } = { ...this.props }
    if (value !== nextProps.value) this.setState({ value: nextProps.value, })
     else if (edit !== nextProps.edit) this.setState({ active: nextProps.edit, })
  }
  render() {
    const { active, value } = { ...this.state }
    const { label, options = [], classNames, locked } = { ...this.props }
    const current = value
    let display = ' - - - - - '
    const displays = options.filter( option => option.value === value )
    if (displays.length > 0) display = displays[0].name

    const mapOption = ({ name, value }) => {
      const selected = (value === current) && 'selected'
      const id = `option-${ name }-${ value }`
      return (
        <button
          className={`select-option input input-button ${selected}`}
          key={ id }
          onKeyDown = { this.handleKeyDown }
          id={ id }
          value={ value }
          name={ name }
          onClick={ this.setValue } >
          { name }
        </button>
      )
    }

    const inputLabel = makeInputLabel(label)
    let inputContent = makeDisplayButton(display, this.handleToggle, 'displaying')
    if (active) inputContent = options.map( mapOption )
    if (locked) inputContent = makeInputLabel(display)

    return (
      <div className={ `SelectInput ${ classNames }` }>
        { inputLabel }
        <div className='input-content custom-select'>
          { inputContent }
        </div>    
      </div>
    )
  }
}
