import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './TitleSticker.css'

const TitleSticker = ({ position, onUpdatePosition }) => {
  const navigate = useNavigate()
  const [lastTap, setLastTap] = useState(0)
  const [currentScale, setCurrentScale] = useState(position.scale || 1)
  const [currentLogo, setCurrentLogo] = useState('/Logo1.png')
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

  const handleTap = () => {
    const now = Date.now()
    const timeDiff = now - lastTap
    
    if (timeDiff < 300 && timeDiff > 0) {
      // 双击 - 跳转到标题选择页面
      navigate('/title-selector')
    }
    
    setLastTap(now)
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

  return (
    <motion.div
      ref={stickerRef}
      className="title-sticker"
      initial={{ x: position.x, y: position.y, scale: currentScale }}
      animate={{ x: position.x, y: position.y, scale: currentScale }}
      transition={{ duration: 0 }} // 移除动画过渡
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      whileHover={{ scale: currentScale * 1.02 }}
      whileTap={{ scale: currentScale * 0.98 }}
      style={{
        position: 'absolute',
        cursor: 'grab',
        touchAction: 'none',
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
    </motion.div>
  )
}

export default TitleSticker