import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { getLength, getAngle, getCursor } from '../utils'
import StyledRect from './StyledRect'

const zoomableMap = {
  'n': 't',
  's': 'b',
  'e': 'r',
  'w': 'l',
  'ne': 'tr',
  'nw': 'tl',
  'se': 'br',
  'sw': 'bl'
}

const CLICK_RESPONSE_TIME = 300

export default class Rect extends PureComponent {
  clickStart = 0

  static propTypes = {
    styles: PropTypes.object,
    style: PropTypes.object,
    zoomable: PropTypes.string,
    rotatable: PropTypes.bool,
    zIndex: PropTypes.number,
    onClick: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onRotateStart: PropTypes.func,
    onRotate: PropTypes.func,
    onRotateEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    parentRotateAngle: PropTypes.number
  }

  setElementRef = (ref) => { this.$element = ref }

  // Drag
  startDrag = (e) => {
    this.clickStart = Date.now()
    e.persist()
    let { clientX: startX, clientY: startY } = e
    this.props.onDragStart && this.props.onDragStart(e)
    this._isMouseDown = true
    const onMove = (e) => {
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation()
      const { clientX, clientY } = e
      const deltaX = clientX - startX
      const deltaY = clientY - startY
      this.props.onDrag(deltaX, deltaY)
      startX = clientX
      startY = clientY
    }
    const onUp = (e) => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      this.props.onDragEnd && this.props.onDragEnd(e)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // Rotate
  startRotate = (e) => {
    e.persist()
    if (e.button !== 0) return
    const { clientX, clientY } = e
    const { styles: { transform: { rotateAngle: startAngle } } } = this.props
    const rect = this.$element.getBoundingClientRect()
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    const startVector = {
      x: clientX - center.x,
      y: clientY - center.y
    }
    this.props.onRotateStart && this.props.onRotateStart(e)
    this._isMouseDown = true
    const onMove = (e) => {
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation()
      const { clientX, clientY } = e
      const rotateVector = {
        x: clientX - center.x,
        y: clientY - center.y
      }
      const angle = getAngle(startVector, rotateVector)
      this.props.onRotate(angle, startAngle)
    }
    const onUp = (e) => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      this.props.onRotateEnd && this.props.onRotateEnd(e)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  // Resize
  startResize = (e, cursor) => {
    e.persist()
    if (e.button !== 0) return
    document.body.style.cursor = cursor
    const { styles: { position: { centerX, centerY }, size: { width, height }, transform: { rotateAngle } } } = this.props
    const { clientX: startX, clientY: startY } = e
    const rect = { width, height, centerX, centerY, rotateAngle }
    const type = e.target.getAttribute('class').split(' ')[ 0 ]
    this.props.onResizeStart && this.props.onResizeStart(e)
    this._isMouseDown = true
    const onMove = (e) => {
      if (!this._isMouseDown) return // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation()
      const { clientX, clientY } = e
      const deltaX = clientX - startX
      const deltaY = clientY - startY
      const alpha = Math.atan2(deltaY, deltaX)
      const deltaL = getLength(deltaX, deltaY)
      const isShiftKey = e.shiftKey
      this.props.onResize(deltaL, alpha, rect, type, isShiftKey)
    }

    const onUp = (e) => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (!this._isMouseDown) return
      this._isMouseDown = false
      this.props.onResizeEnd && this.props.onResizeEnd(e)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  handleClick = (e) => {
    const { onClick } = this.props
    const dateNow = Date.now()
    if (dateNow - this.clickStart > CLICK_RESPONSE_TIME) {
      return
    }
    onClick()
  }

  render () {
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle }
      },
      style,
      zoomable,
      rotatable,
      parentRotateAngle,
      zIndex
    } = this.props
    const baseStyleRect = {
      width: Math.abs(width),
      height: Math.abs(height),
      transform: `rotate(${rotateAngle}deg)`,
      left: centerX - Math.abs(width) / 2,
      top: centerY - Math.abs(height) / 2,
      ...style
    }
    const styleRect = {
      ...baseStyleRect,
      pointerEvents: 'none',
      zIndex: 1000
    }
    const draggableStyleRect = {
      ...baseStyleRect,
      position: 'absolute',
      zIndex: zIndex || 0,
      pointerEvents: 'auto'
    }
    const direction = zoomable.split(',').map(d => d.trim()).filter(d => d) // TODO: may be speed up

    return (
      <React.Fragment>
        <StyledRect
          ref={this.setElementRef}
          className="rect single-resizer"
          style={styleRect}
        >
          {
            rotatable &&
            <div className="rotate" onMouseDown={this.startRotate}>
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
                  fill="black"
                  fillRule="nonzero"
                />
              </svg>
            </div>
          }

          {
            direction.map(d => {
              const cursor = `${getCursor(rotateAngle + parentRotateAngle, d)}-resize`
              return (
                <div key={d} style={{ cursor }} className={`${zoomableMap[ d ]} resizable-handler`} onMouseDown={(e) => this.startResize(e, cursor)} />
              )
            })
          }

          {
            direction.map(d => {
              return (
                <div key={d} className={`${zoomableMap[ d ]} circle`} />
              )
            })
          }
        </StyledRect>
        <div className="rect single-resizer" onClick={this.handleClick} onMouseDown={this.startDrag} style={draggableStyleRect} />
      </React.Fragment>
    )
  }
}
