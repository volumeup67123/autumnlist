import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './Sticker.css'

const Sticker = ({ item, isCompleted, onUpdatePosition, isEditing, onLongPress }) => {
  const navigate = useNavigate()
  const [lastTap, setLastTap] = useState(0)
  const [currentScale, setCurrentScale] = useState(item.scale)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const stickerRef = useRef(null)
  const initialDistance = useRef(0)
  const initialScale = useRef(item.scale)

  const handleTap = (e) => {
    e.stopPropagation() // 阻止冒泡到父容器
    
    if (isEditing) return // 编辑状态下不响应双击
    
    const now = Date.now()
    const timeDiff = now - lastTap
    
    if (timeDiff < 300 && timeDiff > 0) {
      // 双击 - 进入 Journal
      navigate(`/journal/${item.id}`)
    }
    
    setLastTap(now)
  }

  const handleLongPressStart = (e) => {
    // 只在编辑状态下阻止默认行为
    if (isEditing) {
      e.preventDefault()
    }
    e.stopPropagation()
    if (isEditing) return // 已经在编辑状态
    
    setLongPressTriggered(false)
    
    const timer = setTimeout(() => {
      onLongPress(item.id)
      setLongPressTriggered(true)
    }, 330) // 330ms，响应更快
    
    setLongPressTimer(timer)
  }

  const handleLongPressEnd = (e) => {
    // 只在编辑状态下阻止默认行为
    if (isEditing) {
      e.preventDefault()
    }
    
    // 如果长按已经触发，不要清除定时器
    if (longPressTriggered) {
      return
    }
    
    // 否则清除定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleDragEnd = (event, info) => {
    const newX = item.x + info.offset.x
    const newY = item.y + info.offset.y
    onUpdatePosition(item.id, newX, newY, currentScale)
  }

  // 计算两点间距离
  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      initialDistance.current = getDistance(e.touches[0], e.touches[1])
      initialScale.current = currentScale
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const currentDistance = getDistance(e.touches[0], e.touches[1])
      const scaleChange = currentDistance / initialDistance.current
      const newScale = Math.max(0.5, Math.min(2, initialScale.current * scaleChange))
      setCurrentScale(newScale)
    }
  }

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      onUpdatePosition(item.id, item.x, item.y, currentScale)
    }
  }

  useEffect(() => {
    setCurrentScale(item.scale)
  }, [item.scale])

  useEffect(() => {
    if (!isEditing) {
      setLongPressTriggered(false)
    }
  }, [isEditing])

  return (
    <motion.div
      ref={stickerRef}
      className={`sticker ${isCompleted ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
      initial={{ x: item.x, y: item.y, scale: currentScale }}
      animate={{ x: item.x, y: item.y, scale: currentScale }}
      drag={isEditing} // 只有编辑状态下才能拖拽
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      onTouchStart={(e) => {
        handleLongPressStart(e)
        if (isEditing) handleTouchStart(e)
      }}
      onTouchMove={(e) => {
        if (!longPressTriggered) {
          handleLongPressEnd(e) // 移动时取消长按
        }
        if (isEditing) handleTouchMove(e)
      }}
      onTouchEnd={(e) => {
        handleLongPressEnd(e)
        if (isEditing) handleTouchEnd(e)
      }}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
      whileHover={isEditing ? { scale: currentScale * 1.05 } : {}}
      whileTap={false} // 完全禁用 tap 动画
      style={{
        position: 'absolute',
        cursor: isEditing ? 'grab' : 'pointer',
        touchAction: isEditing ? 'none' : 'auto', // 非编辑状态允许页面滚动
        x: item.x,
        y: item.y,
        scale: currentScale
      }}
    >
      <div className="sticker-content">
        {item.sticker ? (
          <img 
            src={item.sticker} 
            alt={item.name}
            className="sticker-image"
          />
        ) : (
          <div className="sticker-emoji">{item.emoji}</div>
        )}
        <div className="sticker-name">{item.name}</div>
        {isCompleted && <div className="completion-check">✓</div>}
        {isEditing && <div className="editing-outline"></div>}
      </div>
    </motion.div>
  )
}

export default Sticker