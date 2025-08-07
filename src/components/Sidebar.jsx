import React from 'react'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose, items, selectedItems, onToggleItem }) => {
  const isItemSelected = (itemId) => {
    return selectedItems.some(selected => selected.id === itemId)
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>秋日愿望清单</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="sidebar-content">
          <p className="sidebar-description">
            选择你想在这个秋天完成的事情
          </p>
          
          <div className="items-list">
            {items.map(item => (
              <div 
                key={item.id}
                className={`item ${isItemSelected(item.id) ? 'selected' : ''}`}
                onClick={() => onToggleItem(item)}
              >
                {item.sticker ? (
                  <img src={item.sticker} alt={item.name} className="item-sticker" />
                ) : (
                  <span className="item-emoji">{item.emoji}</span>
                )}
                <span className="item-name">{item.name}</span>
                <span className="item-check">
                  {isItemSelected(item.id) ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
          
          <div className="add-custom">
            <button className="add-btn">
              + 添加自定义项目
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar