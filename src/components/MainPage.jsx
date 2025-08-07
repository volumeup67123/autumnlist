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

  // 组件加载时读取 localStorage 中的状态
  React.useEffect(() => {
    const loadData = () => {
      const completed = JSON.parse(localStorage.getItem('completedItems') || '[]')
      const selected = JSON.parse(localStorage.getItem('selectedItems') || '[]')
      const customTitles = JSON.parse(localStorage.getItem('customTitles') || '{}')
      const titlePos = JSON.parse(localStorage.getItem('titlePosition') || 'null') || getDefaultTitlePosition()
      
      // 只更新主页贴纸的自定义标题，侧边栏保持原样
      const updatedSelected = selected.map(item => {
        const originalItem = bucketListItems.find(original => original.id === item.id)
        return {
          ...item,
          name: customTitles[item.id] || (originalItem ? originalItem.name : item.name)
        }
      })
      
      setCompletedItems(completed)
      setSelectedItems(updatedSelected)
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
    { id: 'read-with-blanket', name: 'Read with a blanket', sticker: '/stickers/Read with a blanket.png' },
    { id: 'bake-something-sweet', name: 'Bake something sweet', sticker: '/stickers/Bake something sweet.png' },
    { id: 'hot-cocoa', name: 'Hot cocoa', sticker: '/stickers/Hot cocoa.png' },
    { id: 'light-seasonal-candle', name: 'Light a seasonal candle', sticker: '/stickers/Light a seasonal candle.png' },
    { id: 'taste-cake', name: 'Taste a cake', sticker: '/stickers/Taste a cake.png' },
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
    { id: 'make-soup', name: '从零开始做汤', emoji: '🍲' },
    { id: 'collect-leaves', name: '收集落叶', emoji: '🍂' },
    { id: 'read-book', name: '蜷缩读书', emoji: '📚' },
    { id: 'bake-pie', name: '烘焙派', emoji: '🥧' },
    { id: 'cozy-sweater', name: '淘一件温暖毛衣', emoji: '🧥' },
    { id: 'pumpkin-patch', name: '参观南瓜田', emoji: '🎃' },
    { id: 'farmers-market', name: '逛农贸市场', emoji: '🛒' },
    { id: 'fall-photo', name: '拍秋日照片', emoji: '📸' },
    { id: 'autumn-picnic', name: '秋日野餐', emoji: '🧺' },
    { id: 'fall-decor', name: '秋日装饰', emoji: '🍁' },
    { id: 'pumpkin-flavor', name: '品尝南瓜味食物', emoji: '🎃' },
    { id: 'favorite-boots', name: '穿最爱的靴子', emoji: '👢' },
    { id: 'smores', name: '烤棉花糖', emoji: '🔥' },
    { id: 'fall-drink', name: '点秋日特饮', emoji: '☕' },
    { id: 'rain-walk', name: '雨中漫步', emoji: '☔' },
    { id: 'fall-bouquet', name: '制作秋日花束', emoji: '💐' },
    { id: 'fall-crafts', name: '秋日手工', emoji: '✂️' },
    { id: 'fall-candle', name: '点燃秋日蜡烛', emoji: '🕯️' },
    { id: 'bike-park', name: '公园骑行', emoji: '🚲' }
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
        newSelected = [...prev, { 
          ...item, 
          x: Math.random() * 200, 
          y: Math.random() * 200, 
          scale: 1 
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

  const handleClickOutside = () => {
    setEditingStickerId(null)
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
        {/* 可拖拽的标题贴纸 */}
        <TitleSticker 
          position={titlePosition}
          onUpdatePosition={updateTitlePosition}
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