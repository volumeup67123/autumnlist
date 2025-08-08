import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './TitleSticker.css'

const TitleSticker = ({ position, onUpdatePosition, isEditing, onLongPress }) => {
  const navigate = useNavigate()
  const [lastTap, setLastTap] = useState(0)
  const [currentScale, setCurrentScale] = useState(position.scale || 1)
  const [currentLogo, setCurrentLogo] = useState('/Logo1.png')
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const stickerRef = useRef(null)
  const initialDistance = useRef(0)
  const initialScale = useRef(position.scale || 1)

  // 组件加载时读取保存的logo选择
  useEffect(() => {
    const loadLogo = () => {
      const savedLogo = localStorage.getItem('selectedLogo') || '/Logo1.png'
      setCurrentLogo(savedLogo)
    }
    
    loadLogo()
    
    // 监听页面焦点，当从选择页面返回时重新加载
    const handleFocus = () => {
      loadLogo()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const handleTap = (e) => {
    e.stopPropagation() // 阻止冒泡到父容器
    
    if (isEditing) return // 编辑状态下不响应双击
    
    const now = Date.now()
    const timeDiff = now - lastTap
    
    if (timeDiff < 300 && timeDiff > 0) {
      // 双击 - 跳转到标题选择页面
      navigate('/title-selector')
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
      onLongPress()
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

  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event, info) => {
    const newX = position.x + info.offset.x
    const newY = position.y + info.offset.y
    onUpdatePosition(newX, newY, currentScale)
    setIsDragging(false)
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
      onUpdatePosition(position.x, position.y, currentScale)
    }
  }

  useEffect(() => {
    setCurrentScale(position.scale || 1)
  }, [position.scale])

  useEffect(() => {
    if (!isEditing) {
      setLongPressTriggered(false)
    }
  }, [isEditing])

  return (
    <motion.div
      ref={stickerRef}
      className={`title-sticker ${isEditing ? 'editing' : ''}`}
      initial={{ x: position.x, y: position.y, scale: currentScale }}
      animate={{ x: position.x, y: position.y, scale: currentScale }}
      transition={{ duration: 0 }} // 移除动画过渡
      drag={isEditing} // 只有编辑状态下才能拖拽
      dragMomentum={false}
      onDragStart={handleDragStart}
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
      whileHover={isEditing ? { scale: currentScale * 1.02 } : {}}
      whileTap={false} // 完全禁用 tap 动画
      style={{
        position: 'absolute',
        cursor: isEditing ? 'grab' : 'pointer',
        touchAction: isEditing ? 'none' : 'auto', // 非编辑状态允许页面滚动
        x: position.x,
        y: position.y,
        scale: currentScale
      }}
    >
      <img 
        src={currentLogo} 
        alt="Autumn Bucket List" 
        className={`title-logo-draggable ${isDragging ? 'dragging' : ''}`}
      />
      {isEditing && <div className="title-editing-outline"></div>}
    </motion.div>
  )
}

export default TitleSticker