import React from 'react'
import './TitleSelector.css'

const TitleSelector = ({ isOpen, currentLogo, onSelect, onClose }) => {
  const logoOptions = [
    { id: 'logo1', src: '/Logo1.png', name: 'Autumn Bucket List - 经典版' },
    { id: 'logo2', src: '/logo2.png', name: 'Autumn Bucket List - 风格2' }
  ]

  if (!isOpen) return null

  return (
    <>
      <div className="title-selector-overlay" onClick={onClose} />
      <div className="title-selector">
        <div className="selector-header">
          <h3>选择标题样式</h3>
          <button className="close-selector-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="logo-options">
          {logoOptions.map(logo => (
            <div 
              key={logo.id}
              className={`logo-option ${currentLogo === logo.src ? 'selected' : ''}`}
              onClick={() => onSelect(logo.src)}
            >
              <img src={logo.src} alt={logo.name} className="logo-preview" />
              <p className="logo-name">{logo.name}</p>
              {currentLogo === logo.src && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TitleSelector