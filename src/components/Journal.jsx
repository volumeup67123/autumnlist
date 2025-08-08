import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Journal.css'

const Journal = () => {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const [notes, setNotes] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [customTitle, setCustomTitle] = useState('')

  // 组件加载时检查完成状态和自定义标题
  React.useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completedItems') || '[]')
    const customTitles = JSON.parse(localStorage.getItem('customTitles') || '{}')
    setIsCompleted(completed.includes(itemId))
    setCustomTitle(customTitles[itemId] || '')
  }, [itemId])

  // 这里应该根据 itemId 获取对应的项目信息
  const getItemInfo = (id) => {
    const items = {
      'read-under-blanket': { name: 'Read under a blanket', sticker: '/stickers/Read under a blanket.png' },
      'have-slice-of-cake': { name: 'Have a slice of cake', sticker: '/stickers/Have a slice of cake.png' },
      'bake-something-sweet': { name: 'Bake something sweet', sticker: '/stickers/Bake something sweet.png' },
      'hot-cocoa': { name: 'Hot cocoa', sticker: '/stickers/Hot cocoa.png' },
      'light-seasonal-candle': { name: 'Light a seasonal candle', sticker: '/stickers/Light a seasonal candle.png' },
      'change-wallpaper': { name: 'Change wallpaper', sticker: '/stickers/Change wallpaper.png' },
      'curate-autumn-playlist': { name: 'Curate an autumn playlist', sticker: '/stickers/Curate an autumn playlist.png' },
      'do-longer-skincare': { name: 'Do a longer skincare', sticker: '/stickers/Do a longer skincare.png' },
      'make-jam': { name: 'Make jam', sticker: '/stickers/Make jam.png' },
      'put-on-fuzzy-socks': { name: 'Put on fuzzy socks', sticker: '/stickers/Put on fuzzy socks.png' },
      'slip-into-warm-slippers': { name: 'Slip into warm slippers', sticker: '/stickers/Slip into warm slippers.png' },
      'try-new-soup': { name: 'Try a new soup', sticker: '/stickers/Try a new soup.png' },
      'watch-cozy-movie': { name: 'Watch a cozy movie', sticker: '/stickers/Watch a cozy movie.png' },
      'wear-favorite-sweater': { name: 'Wear favorite sweater', sticker: '/stickers/Wear favorite sweater.png' },
      'wrap-up-in-scarf': { name: 'Wrap up in a scarf', sticker: '/stickers/Wrap up in a scarf.png' },
      'an-autumn-drive': { name: 'An autumn drive', sticker: '/stickers/An autumn drive.png' },
      'an-autumn-tarot-deck': { name: 'An autumn tarot deck', sticker: '/stickers/An autumn tarot deck.png' },
      'browse-market': { name: 'Browse a market', sticker: '/stickers/Browse a market.png' },
      'clean-up-desk': { name: 'Clean up my desk', sticker: '/stickers/Clean up my desk.png' },
      'enjoy-cup-of-coffee': { name: 'Enjoy a cup of coffee', sticker: '/stickers/Enjoy a cup of coffee.png' },
      'explore-vintage-store': { name: 'Explore a vintage store', sticker: '/stickers/Explore a vintage store.png' },
      'find-perfect-tree': { name: 'Find a perfect tree', sticker: '/stickers/Find a perfect tree.png' },
      'get-ready-halloween': { name: 'Get ready for Halloween', sticker: '/stickers/Get ready for Halloween.png' },
      'go-camping': { name: 'Go camping', sticker: '/stickers/Go camping.png' },
      'go-hiking': { name: 'Go hiking', sticker: '/stickers/Go hiking.png' },
      'go-stargazing': { name: 'Go stargazing', sticker: '/stickers/Go stargazing.png' },
      'have-picnic': { name: 'Have a picnic', sticker: '/stickers/Have a picnic.png' },
      'listen-to-rain': { name: 'Listen to the rain', sticker: '/stickers/Listen to the rain.png' },
      'make-bouquet': { name: 'Make a bouquet', sticker: '/stickers/Make a bouquet.png' },
      'pick-fallen-leaf': { name: 'Pick a fallen leaf', sticker: '/stickers/Pick a fallen leaf.png' },
      'pick-apples': { name: 'Pick apples', sticker: '/stickers/Pick apples.png' },
      'ride-bike': { name: 'Ride a bike', sticker: '/stickers/Ride a bike.png' },
      'send-postcard': { name: 'Send a postcard', sticker: '/stickers/Send a postcard.png' },
      'start-journal': { name: 'Start a journal', sticker: '/stickers/Start a journal.png' },
      'stroll-in-park': { name: 'Stroll in the park', sticker: '/stickers/Stroll in the park.png' },
      'take-golden-trip': { name: 'Take a golden trip', sticker: '/stickers/Take a golden trip.png' },
      'take-train-ride': { name: 'Take a train ride', sticker: '/stickers/Take a train ride.png' },
      'take-autumn-photo': { name: 'Take an autumn photo', sticker: '/stickers/Take an autumn photo.png' },
      'tidy-up-room': { name: 'Tidy up my room', sticker: '/stickers/Tidy up my room.png' },
      'try-pumpkin-recipe': { name: 'Try a pumpkin recipe', sticker: '/stickers/Try a pumpkin recipe.png' },
      'visit-favorite-bookstore': { name: 'Visit favorite bookstore', sticker: '/stickers/Visit favorite bookstore.png' }
    }
    return items[id] || { name: '未知项目', emoji: '❓' }
  }

  const itemInfo = getItemInfo(itemId)

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleToggleComplete = () => {
    const completed = JSON.parse(localStorage.getItem('completedItems') || '[]')
    
    if (isCompleted) {
      // 取消完成
      const newCompleted = completed.filter(id => id !== itemId)
      localStorage.setItem('completedItems', JSON.stringify(newCompleted))
      setIsCompleted(false)
    } else {
      // 标记为完成
      if (!completed.includes(itemId)) {
        completed.push(itemId)
        localStorage.setItem('completedItems', JSON.stringify(completed))
      }
      setIsCompleted(true)
    }
  }

  const handleTitleEdit = () => {
    setIsEditingTitle(true)
  }

  const handleTitleSave = (newTitle) => {
    if (newTitle.trim()) {
      // 保存自定义标题
      const customTitles = JSON.parse(localStorage.getItem('customTitles') || '{}')
      customTitles[itemId] = newTitle.trim()
      localStorage.setItem('customTitles', JSON.stringify(customTitles))
      
      // 更新选中项目的标题
      const selectedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]')
      const updatedItems = selectedItems.map(item => 
        item.id === itemId ? { ...item, name: newTitle.trim() } : item
      )
      localStorage.setItem('selectedItems', JSON.stringify(updatedItems))
      
      setCustomTitle(newTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave(e.target.value)
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId))
  }

  return (
    <div className="journal">
      <header className="journal-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <div className="journal-title">
          {itemInfo.sticker ? (
            <img src={itemInfo.sticker} alt={itemInfo.name} className="journal-sticker" />
          ) : (
            <span className="journal-emoji">{itemInfo.emoji}</span>
          )}
          {isEditingTitle ? (
            <input
              type="text"
              className="title-input"
              defaultValue={customTitle || itemInfo.name}
              onBlur={(e) => handleTitleSave(e.target.value)}
              onKeyDown={handleTitleKeyPress}
              autoFocus
            />
          ) : (
            <div className="title-section">
              <h1 onClick={handleTitleEdit} className="editable-title">
                {customTitle || itemInfo.name}
              </h1>
              {customTitle && (
                <button 
                  className="reset-title-btn"
                  onClick={() => handleTitleSave(itemInfo.name)}
                  title="重置到原始标题"
                >
                  ↺
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="journal-content">
        <section className="photos-section">
          <h2>📸 记录时刻</h2>
          <div className="photo-upload">
            <input
              type="file"
              id="photo-input"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="photo-input" className="upload-btn">
              + 添加照片
            </label>
          </div>
          
          {photos.length > 0 && (
            <div className="photos-grid">
              {photos.map(photo => (
                <div key={photo.id} className="photo-item">
                  <img src={photo.url} alt={photo.name} />
                  <button 
                    className="remove-photo"
                    onClick={() => removePhoto(photo.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="notes-section">
          <h2>📝 心情记录</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="记录下这个美好时刻的感受..."
            className="notes-textarea"
          />
        </section>

        <div className="journal-actions">
          <button 
            className={`complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleToggleComplete}
          >
            {isCompleted ? '↺ 取消完成' : '✓ 标记为完成'}
          </button>
          
          <button className="back-to-main-btn" onClick={() => navigate('/')}>
            返回主页
          </button>
        </div>
      </div>
    </div>
  )
}

export default Journal