import { useMemo, useState } from 'react'
import { site } from './siteContent'
import './App.css'
import './fixFullscreen.css'

function daysTogether(sinceIso: string): number | null {
  const start = new Date(sinceIso + 'T12:00:00')
  if (Number.isNaN(start.getTime())) return null
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export default function App() {
  const [showSurprise, setShowSurprise] = useState(false)
  const [noButtonText, setNoButtonText] = useState('No')
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [clickCount, setClickCount] = useState(0)
  const [buttonScale, setButtonScale] = useState(1)
  const [currentSection, setCurrentSection] = useState('letter') // 'letter' or 'pictures'
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  
  const handleYes = () => {
    setShowSurprise(true)
  }
  
  const handleNo = () => {
    const messages = [
      'No',
      'Are you sure?',
      'Really sure?',
      'Think again...',
      'Last chance!',
      'You really want to miss this?',
      '😢',
      '🥺',
      'Okay... but are you REALLY sure?',
      'Button is getting lonely...',
      'Say yes! 💕',
    ]
    const currentIndex = messages.indexOf(noButtonText)
    const nextIndex = (currentIndex + 1) % messages.length
    setNoButtonText(messages[nextIndex])
    
    // Make button teleport after a few clicks
    if (clickCount > 2) {
      const randomX = (Math.random() - 0.5) * 600 // -300 to 300
      const randomY = (Math.random() - 0.5) * 600 // -300 to 300
      setButtonPosition({ x: randomX, y: randomY })
      
      // Shrink button with each click
      setButtonScale(prev => Math.max(0.3, prev - 0.08))
    }
    
    setClickCount(clickCount + 1)
  }
  const days = useMemo(
    () => daysTogether(site.togetherSince),
    [site.togetherSince],
  )

  const gallery =
    site.photos.length > 0
      ? site.photos
      : [
          { src: '', caption: 'Photo 1 — add to public/photos/ and siteContent' },
          { src: '', caption: 'Photo 2' },
          { src: '', caption: 'Photo 3' },
        ]

  if (!showSurprise) {
    return (
      <div className="page">
        <div className="glow" aria-hidden="true" />
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Ready for a surprise? 💕</h2>
            <div className="modal-buttons">
              <button className="btn btn-yes" onClick={handleYes}>
                Yes
              </button>
              <button 
                className="btn btn-no" 
                onClick={handleNo}
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px) scale(${buttonScale})`,
                  transition: 'transform 0.1s ease-out',
                  position: 'relative',
                }}
              >
                {noButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />

      <header className="hero">
        <p className="eyebrow">{site.heroEyebrow}</p>
        <h1 className="hero-title">{site.heroTitle}</h1>
        <p className="hero-name">For {site.herName}</p>
        {days !== null && (
          <p className="hero-stat">
            <span className="hero-stat-num">365</span>
            <span className="hero-stat-label">days together</span>
          </p>
        )}
        <div className="hero-lines">
          {site.heroLines.map((line, i) => (
            <p key={i} className="hero-line">
              {line}
            </p>
          ))}
        </div>
      </header>

      {currentSection === 'letter' ? (
        <section className="section letter" aria-labelledby="letter-heading">
          <h2 id="letter-heading" className="section-title visually-hidden">
            A note for you
          </h2>
          <div className="letter-paper">
            {site.letterParagraphs.map((p, i) => (
              <p key={i} className="letter-p">
                {p}
              </p>
            ))}
            <p className="letter-signoff">
              With love,
              <br />
              <span className="letter-name">{site.yourName}</span>
            </p>
          </div>
          <button 
            className="nav-arrow nav-next"
            onClick={() => setCurrentSection('pictures')}
            aria-label="Go to pictures"
          >
            →
          </button>
        </section>
      ) : (
        <section className="section pictures" aria-labelledby="pictures-heading">
          <h2 id="pictures-heading" className="section-title">
            Us, in pictures
          </h2>
          <div className="gallery">
            {gallery.map((item, i) => (
              <figure key={i} className="photo-card">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.caption ?? ''}
                    loading="lazy"
                    onClick={() => setFullscreenImage(item.src)}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <div className="photo-placeholder" role="img" aria-label="Photo placeholder">
                    <span className="photo-placeholder-icon" aria-hidden="true">
                      ♥
                    </span>
                  </div>
                )}
                {item.caption && (
                  <figcaption className="photo-caption">{item.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
          <button 
            className="nav-arrow nav-prev"
            onClick={() => setCurrentSection('letter')}
            aria-label="Back to message"
          >
            ←
          </button>
        </section>
      )}

      <footer className="footer">
        <p className="footer-text">Made for you · {site.herName}</p>
      </footer>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fullscreen-overlay"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="fullscreen-close"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close fullscreen"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
