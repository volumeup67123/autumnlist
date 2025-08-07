import React from 'react'
import { useNavigate } from 'react-router-dom'
import './TitleSelectorPage.css'

const TitleSelectorPage = () => {
  const navigate = useNavigate()
  
  const logoOptions = [
    { id: 'logo1', src: '/Logo1.png' },
    { id: 'logo2', src: '/logo2.png' }
  ]

  const currentLogo = localStorage.getItem('selectedLogo') || '/Logo1.png'

  const handleLogoSelect = (logoSrc) => {
    localStorage.setItem('selectedLogo', logoSrc)
    navigate('/')
  }

  return (
    <div className="title-selector-page">
      <header className="selector-page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>选择标题样式</h1>
      </header>

      <div className="selector-page-content">
        <div className="logo-grid">
          {logoOptions.map(logo => (
            <div 
              key={logo.id}
              className={`logo-card ${currentLogo === logo.src ? 'selected' : ''}`}
              onClick={() => handleLogoSelect(logo.src)}
            >
              <div className="logo-preview-container">
                <img src={logo.src} alt="Logo option" className="logo-preview-large" />
                {currentLogo === logo.src && (
                  <div className="selected-badge">
                    <span>Now</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TitleSelectorPage