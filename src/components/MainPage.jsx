import React, { useState } from 'react'
import Sidebar from './Sidebar'
import StickerBoard from './StickerBoard'
import TitleSticker from './TitleSticker'
import './MainPage.css'

const MainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [completedItems, setCompletedItems] = useState([])
  // 计算默认标题位置（居中上方）
  const getDefaultTitlePosition = () => {
    const screenWidth = window.innerWidth
    const logoWidth = screenWidth > 768 ? 280 : 240
    return {
      x: (screenWidth - logoWidth) / 2,
      y: 20,
      scale: 1
    }
  }
  
  const [titlePosition, setTitlePosition] = useState(getDefaultTitlePosition())
  const [editingStickerId, setEditingStickerId] = useState(null)
  const [editingTitle, setEditingTitle] = useState(false)

  // 组件加载时读取 localStorage 中的状态
  React.useEffect(() => {
    const loadData = () => {
      const completed = JSON.parse(localStorage.getItem('completedItems') || '[]')
      let selected = JSON.parse(localStorage.getItem('selectedItems') || '[]')
      const customTitles = JSON.parse(localStorage.getItem('customTitles') || '{}')
      const titlePos = JSON.parse(localStorage.getItem('titlePosition') || 'null') || getDefaultTitlePosition()
      
      // 数据迁移：更新旧的ID为新的ID
      const idMigrationMap = {
        'read-with-blanket': 'read-under-blanket',
        'taste-cake': 'have-slice-of-cake'
      }
      
      // 迁移选中的贴纸
      selected = selected.map(item => {
        if (idMigrationMap[item.id]) {
          return { ...item, id: idMigrationMap[item.id] }
        }
        return item
      }).filter(item => bucketListItems.find(bucketItem => bucketItem.id === item.id)) // 过滤掉不存在的项目
      
      // 迁移完成状态
      const migratedCompleted = completed.map(id => idMigrationMap[id] || id)
        .filter(id => bucketListItems.find(item => item.id === id)) // 过滤掉不存在的项目
      
      // 只更新主页贴纸的自定义标题，侧边栏保持原样
      const updatedSelected = selected.map(item => {
        const originalItem = bucketListItems.find(original => original.id === item.id)
        return {
          ...item,
          name: customTitles[item.id] || (originalItem ? originalItem.name : item.name)
        }
      })
      
      setCompletedItems(migratedCompleted)
      setSelectedItems(updatedSelected)
      
      // 保存迁移后的数据
      localStorage.setItem('selectedItems', JSON.stringify(selected))
      localStorage.setItem('completedItems', JSON.stringify(migratedCompleted))
      setTitlePosition(titlePos)
    }
    
    loadData()
    
    // 监听页面焦点，当从其他页面返回时重新加载
    const handleFocus = () => {
      loadData()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // 监听窗口大小变化，如果标题还在默认位置则重新居中
    const handleResize = () => {
      const currentPos = JSON.parse(localStorage.getItem('titlePosition') || 'null')
      if (!currentPos) {
        setTitlePosition(getDefaultTitlePosition())
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 默认的秋日愿望清单项目
  const bucketListItems = [
    { id: 'read-under-blanket', name: 'Read under a blanket', sticker: '/stickers/Read under a blanket.png' },
    { id: 'have-slice-of-cake', name: 'Have a slice of cake', sticker: '/stickers/Have a slice of cake.png' },
    { id: 'bake-something-sweet', name: 'Bake something sweet', sticker: '/stickers/Bake something sweet.png' },
    { id: 'hot-cocoa', name: 'Hot cocoa', sticker: '/stickers/Hot cocoa.png' },
    { id: 'light-seasonal-candle', name: 'Light a seasonal candle', sticker: '/stickers/Light a seasonal candle.png' },
    { id: 'change-wallpaper', name: 'Change wallpaper', sticker: '/stickers/Change wallpaper.png' },
    { id: 'curate-autumn-playlist', name: 'Curate an autumn playlist', sticker: '/stickers/Curate an autumn playlist.png' },
    { id: 'do-longer-skincare', name: 'Do a longer skincare', sticker: '/stickers/Do a longer skincare.png' },
    { id: 'make-jam', name: 'Make jam', sticker: '/stickers/Make jam.png' },
    { id: 'put-on-fuzzy-socks', name: 'Put on fuzzy socks', sticker: '/stickers/Put on fuzzy socks.png' },
    { id: 'slip-into-warm-slippers', name: 'Slip into warm slippers', sticker: '/stickers/Slip into warm slippers.png' },
    { id: 'try-new-soup', name: 'Try a new soup', sticker: '/stickers/Try a new soup.png' },
    { id: 'watch-cozy-movie', name: 'Watch a cozy movie', sticker: '/stickers/Watch a cozy movie.png' },
    { id: 'wear-favorite-sweater', name: 'Wear favorite sweater', sticker: '/stickers/Wear favorite sweater.png' },
    { id: 'wrap-up-in-scarf', name: 'Wrap up in a scarf', sticker: '/stickers/Wrap up in a scarf.png' },
    { id: 'an-autumn-drive', name: 'An autumn drive', sticker: '/stickers/An autumn drive.png' },
    { id: 'an-autumn-tarot-deck', name: 'An autumn tarot deck', sticker: '/stickers/An autumn tarot deck.png' },
    { id: 'browse-market', name: 'Browse a market', sticker: '/stickers/Browse a market.png' },
    { id: 'clean-up-desk', name: 'Clean up my desk', sticker: '/stickers/Clean up my desk.png' },
    { id: 'enjoy-cup-of-coffee', name: 'Enjoy a cup of coffee', sticker: '/stickers/Enjoy a cup of coffee.png' },
    { id: 'explore-vintage-store', name: 'Explore a vintage store', sticker: '/stickers/Explore a vintage store.png' },
    { id: 'find-perfect-tree', name: 'Find a perfect tree', sticker: '/stickers/Find a perfect tree.png' },
    { id: 'get-ready-halloween', name: 'Get ready for Halloween', sticker: '/stickers/Get ready for Halloween.png' },
    { id: 'go-camping', name: 'Go camping', sticker: '/stickers/Go camping.png' },
    { id: 'go-hiking', name: 'Go hiking', sticker: '/stickers/Go hiking.png' },
    { id: 'go-stargazing', name: 'Go stargazing', sticker: '/stickers/Go stargazing.png' },
    { id: 'have-picnic', name: 'Have a picnic', sticker: '/stickers/Have a picnic.png' },
    { id: 'listen-to-rain', name: 'Listen to the rain', sticker: '/stickers/Listen to the rain.png' },
    { id: 'make-bouquet', name: 'Make a bouquet', sticker: '/stickers/Make a bouquet.png' },
    { id: 'pick-fallen-leaf', name: 'Pick a fallen leaf', sticker: '/stickers/Pick a fallen leaf.png' },
    { id: 'pick-apples', name: 'Pick apples', sticker: '/stickers/Pick apples.png' },
    { id: 'ride-bike', name: 'Ride a bike', sticker: '/stickers/Ride a bike.png' },
    { id: 'send-postcard', name: 'Send a postcard', sticker: '/stickers/Send a postcard.png' },
    { id: 'start-journal', name: 'Start a journal', sticker: '/stickers/Start a journal.png' },
    { id: 'stroll-in-park', name: 'Stroll in the park', sticker: '/stickers/Stroll in the park.png' },
    { id: 'take-golden-trip', name: 'Take a golden trip', sticker: '/stickers/Take a golden trip.png' },
    { id: 'take-train-ride', name: 'Take a train ride', sticker: '/stickers/Take a train ride.png' },
    { id: 'take-autumn-photo', name: 'Take an autumn photo', sticker: '/stickers/Take an autumn photo.png' },
    { id: 'tidy-up-room', name: 'Tidy up my room', sticker: '/stickers/Tidy up my room.png' },
    { id: 'try-pumpkin-recipe', name: 'Try a pumpkin recipe', sticker: '/stickers/Try a pumpkin recipe.png' },
    { id: 'visit-favorite-bookstore', name: 'Visit favorite bookstore', sticker: '/stickers/Visit favorite bookstore.png' }
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleItemSelection = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(selected => selected.id === item.id)
      let newSelected
      if (isSelected) {
        newSelected = prev.filter(selected => selected.id !== item.id)
      } else {
        // 简单随机分布算法：充分利用整个屏幕
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const stickerSize = 60 // 贴纸大小（减小，因为实际缩放到75%）
        const margin = 10 // 边距（减小边距）
        
        // 可用区域：整个屏幕减去边距和贴纸大小
        const minX = margin
        const maxX = screenWidth - stickerSize - margin
        const minY = 180 // 标题下方
        const maxY = screenHeight - stickerSize - margin
        
        // 调试：检查计算是否正确
        console.log('计算检查:', {
          screenWidth,
          stickerSize,
          margin,
          '计算的maxX': screenWidth - stickerSize - margin,
          '实际maxX': maxX
        })
        
        // 在页面上显示调试信息
        const debugInfo = `屏幕: ${screenWidth}x${screenHeight}, 可用区域: X(${minX}-${maxX}) Y(${minY}-${maxY})`
        console.log('Screen dimensions:', { screenWidth, screenHeight })
        console.log('Available area:', { minX, maxX, minY, maxY })
        
        // 使用简单的网格分布，确保贴纸分散
        const cols = 3 // 3列
        const rows = Math.ceil((prev.length + 1) / cols) // 根据贴纸数量计算行数
        
        const currentIndex = prev.length
        const col = currentIndex % cols
        const row = Math.floor(currentIndex / cols)
        
        const cellWidth = (maxX - minX) / cols
        const cellHeight = Math.min(120, (maxY - minY) / Math.max(rows, 3))
        
        // 基础网格位置
        const baseX = minX + col * cellWidth + cellWidth * 0.1
        const baseY = minY + row * cellHeight + cellHeight * 0.1
        
        // 添加随机偏移，让布局更自然
        const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.6
        const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.6
        
        let newX = baseX + randomOffsetX
        let newY = baseY + randomOffsetY
        
        // 确保在边界内
        newX = Math.max(minX, Math.min(newX, maxX))
        newY = Math.max(minY, Math.min(newY, maxY))
        
        console.log('New sticker position:', { newX, newY })
        
        // 临时在页面显示调试信息
        const debugElement = document.getElementById('debug-info')
        if (debugElement) {
          debugElement.innerHTML = `
            屏幕尺寸: ${screenWidth} x ${screenHeight}<br>
            可用区域: X(${minX.toFixed(0)} - ${maxX.toFixed(0)}) Y(${minY} - ${maxY.toFixed(0)})<br>
            新贴纸位置: (${newX.toFixed(0)}, ${newY.toFixed(0)})<br>
            已有贴纸数量: ${prev.length}<br>
            所有贴纸位置: ${prev.map(p => `(${p.x.toFixed(0)},${p.y.toFixed(0)})`).join(', ')}
          `
        }
        
        newSelected = [...prev, { 
          ...item, 
          x: newX, 
          y: newY, 
          scale: 0.75 // 默认缩小到75%
        }]
      }
      // 保存到 localStorage
      localStorage.setItem('selectedItems', JSON.stringify(newSelected))
      return newSelected
    })
  }

  const updateStickerPosition = (id, x, y, scale) => {
    setSelectedItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, x, y, scale } : item
      )
      // 保存到 localStorage
      localStorage.setItem('selectedItems', JSON.stringify(updated))
      return updated
    })
  }

  const markAsCompleted = (itemId) => {
    setCompletedItems(prev => [...prev, itemId])
  }

  const updateTitlePosition = (x, y, scale) => {
    const newPosition = { x, y, scale }
    setTitlePosition(newPosition)
    localStorage.setItem('titlePosition', JSON.stringify(newPosition))
  }

  const handleStickerLongPress = (stickerId) => {
    setEditingStickerId(stickerId)
  }

  const handleTitleLongPress = () => {
    setEditingTitle(true)
  }

  const handleClickOutside = () => {
    setEditingStickerId(null)
    setEditingTitle(false)
  }

  return (
    <div className="main-page">
      {/* 三条杠菜单按钮 */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* 贴纸板区域 - 现在包含所有可拖拽元素 */}
      <div className="sticker-board-container" onClick={handleClickOutside}>
        {/* 调试信息显示 */}
        <div id="debug-info" style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          borderRadius: '5px',
          zIndex: 1000,
          maxWidth: '200px'
        }}>
          调试信息将在这里显示
        </div>
        
        {/* 可拖拽的标题贴纸 */}
        <TitleSticker 
          position={titlePosition}
          onUpdatePosition={updateTitlePosition}
          isEditing={editingTitle}
          onLongPress={handleTitleLongPress}
        />

        {/* 用户选择的贴纸 */}
        <StickerBoard 
          items={selectedItems}
          completedItems={completedItems}
          onUpdatePosition={updateStickerPosition}
          editingStickerId={editingStickerId}
          onStickerLongPress={handleStickerLongPress}
        />

        {selectedItems.length === 0 && (
          <div className="empty-state">
            <p>点击左上角菜单，选择你的秋日愿望吧！</p>
          </div>
        )}
      </div>

      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        items={bucketListItems}
        selectedItems={selectedItems}
        onToggleItem={toggleItemSelection}
      />
    </div>
  )
}

export default MainPage