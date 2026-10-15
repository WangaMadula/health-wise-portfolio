import React, { useState } from 'react';
import { theme } from '../styles/theme';

const Logo = ({ size = 'medium', color = 'white' }) => {
  const sizes = {
    small: { fontSize: '24px', iconSize: '32px' },
    medium: { fontSize: '32px', iconSize: '48px' },
    large: { fontSize: '52px', iconSize: '80px' },
    xlarge: { fontSize: '64px', iconSize: '160px' }
  };

  const currentSize = sizes[size];
  const [imgOk, setImgOk] = useState(true);
  // Always use the backend-served root logo path
  const logoSrc = '/api/brand/logo';

  return (
    <div style={{
      ...styles.logo,
      fontSize: currentSize.fontSize,
      color: color
    }}>
      {imgOk ? (
        <img
          src={logoSrc}
          alt="Clinic Logo"
          style={{
            width: currentSize.iconSize,
            height: currentSize.iconSize,
            objectFit: 'contain',
            backgroundColor: 'transparent',
            display: 'block',
            // Helps hide dark (black) backgrounds against dark headers
            mixBlendMode: 'screen'
          }}
          onError={() => setImgOk(false)}
        />
      ) : (
        <div style={{
          ...styles.icon,
          fontSize: currentSize.iconSize
        }}>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: '1em', height: '1em' }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      )}
      {!imgOk && (
        <div style={styles.text}>
          <div style={styles.mainText}>Healthwise</div>
          <div style={styles.subText}>CLINIC</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: theme.fonts.primary,
    fontWeight: 'bold'
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.colors.primary.lightBlue}, ${theme.colors.purple.medium})`,
    borderRadius: '50%',
    padding: '8px',
    color: 'white'
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1
  },
  mainText: {
    fontWeight: '700',
    letterSpacing: '-0.02em'
  },
  subText: {
    fontSize: '0.6em',
    fontWeight: '500',
    opacity: 0.9,
    letterSpacing: '0.15em'
  }
};

export default Logo;