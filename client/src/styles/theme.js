export const theme = {
  colors: {
    // Primary colors - Dark Blue, Light Blue, Purple
    primary: {
      darkBlue: '#1a365d',
      mediumBlue: '#2c5282',
      lightBlue: '#3182ce',
      skyBlue: '#63b3ed',
      paleBlue: '#bee3f8'
    },
    purple: {
      dark: '#553c9a',
      medium: '#7c3aed',
      light: '#a78bfa',
      pale: '#ddd6fe'
    },
    secondary: {
      gray: '#718096',
      lightGray: '#e2e8f0',
      white: '#ffffff',
      black: '#000000'
    },
    status: {
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#4299e1'
    }
  },
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  sizes: {
    header: '70px',
    sidebar: '280px',
    borderRadius: '12px',
    borderRadiusLarge: '20px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};

export const GlobalStyle = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.primary};
    background: #ffffff;
    min-height: 100vh;
    color: ${theme.colors.primary.darkBlue};
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: ${theme.sizes.borderRadius};
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-family: ${theme.fonts.primary};
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary, .btn-secondary {
    background: ${theme.colors.secondary.white};
    color: ${theme.colors.primary.darkBlue};
    border: 2px solid ${theme.colors.primary.skyBlue};
  }

  .btn-primary:hover, .btn-secondary:hover {
    background: ${theme.colors.primary.lightBlue};
    color: white;
    border-color: ${theme.colors.primary.lightBlue};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }

  .card {
    background: ${theme.colors.secondary.white};
    border-radius: ${theme.sizes.borderRadius};
    padding: 24px;
    box-shadow: ${theme.shadows.md};
    border: 1px solid ${theme.colors.secondary.lightGray};
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${theme.colors.primary.darkBlue};
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${theme.colors.secondary.lightGray};
    border-radius: ${theme.sizes.borderRadius};
    font-size: 16px;
    transition: border-color 0.3s ease;
    font-family: ${theme.fonts.primary};
  }

  .form-input:focus {
    outline: none;
    border-color: ${theme.colors.primary.lightBlue};
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  .alert {
    padding: 12px 16px;
    border-radius: ${theme.sizes.borderRadius};
    margin-bottom: 20px;
  }

  .alert-success {
    background: rgba(72, 187, 120, 0.1);
    color: ${theme.colors.status.success};
    border: 1px solid ${theme.colors.status.success};
  }

  .alert-error {
    background: rgba(245, 101, 101, 0.1);
    color: ${theme.colors.status.error};
    border: 1px solid ${theme.colors.status.error};
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${theme.colors.secondary.lightGray};
    border-top: 4px solid ${theme.colors.primary.lightBlue};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    .container {
      padding: 0 15px;
    }
    
    .btn {
      padding: 10px 20px;
      font-size: 14px;
    }
    
    .card {
      padding: 20px;
    }
  }
`;