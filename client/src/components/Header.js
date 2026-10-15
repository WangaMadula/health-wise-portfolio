import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { theme } from '../styles/theme';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaUserMd } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: ${theme.colors.primary.skyBlue};
  color: white;
  padding: 0;
  box-shadow: none;
  border-bottom: none;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  /* Remove space-between to allow custom alignment */
`;

// Group logo and nav on the left so the nav buttons are left-aligned instead of centered
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  text-decoration: none;
`;

// Circular avatar wrapper to visually crop any built-in white borders
const BrandAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const BrandLogo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover; /* fill circle while keeping aspect */
  object-position: center;
  border: 0 !important;
  border-color: transparent;
  outline: none;
  box-shadow: none !important;
  background: transparent;
  display: block;
  background-clip: padding-box;
  -webkit-tap-highlight-color: transparent;
  /* Slight scale to crop any faint white edge baked into the asset */
  transform: scale(1.06);
  transform-origin: center;
`;

const BrandFallback = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
  color: white;
  background: linear-gradient(135deg, ${theme.colors.primary.mediumBlue}, ${theme.colors.purple.medium});
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 880px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.primary.darkBlue};
  background: white;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: ${theme.sizes.borderRadius};
  transition: all 0.3s ease;
  border: 2px solid ${theme.colors.primary.skyBlue};
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &.active {
    background: ${theme.colors.primary.lightBlue};
    color: white;
    border-color: ${theme.colors.primary.lightBlue};
    box-shadow: 0 4px 12px rgba(99, 179, 237, 0.18);
  }

  &:hover {
    background: ${theme.colors.primary.lightBlue};
    color: white;
    border-color: ${theme.colors.primary.lightBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 179, 237, 0.18);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AdminLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: ${theme.colors.primary.darkBlue};
  padding: 10px 18px;
  border: 2px solid ${theme.colors.primary.skyBlue};
  border-radius: ${theme.sizes.borderRadius};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${theme.colors.primary.lightBlue};
    color: white;
    border-color: ${theme.colors.primary.lightBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 179, 237, 0.18);
  }
`;

const LogoutBtn = styled.button`
  background: white;
  color: ${theme.colors.primary.darkBlue};
  border: 2px solid ${theme.colors.primary.skyBlue};
  padding: 10px 18px;
  border-radius: ${theme.sizes.borderRadius};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${theme.colors.primary.lightBlue};
    color: white;
    border-color: ${theme.colors.primary.lightBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 179, 237, 0.18);
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;

  @media (max-width: 880px) {
    display: inline-block;
  }
`;

const MobileNav = styled.div`
  background: ${theme.colors.primary.skyBlue};
  padding: 16px;
  display: none;

  @media (max-width: 880px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${theme.colors.primary.darkBlue};
  background: white;
  text-decoration: none;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  border-radius: ${theme.sizes.borderRadius};
  margin-bottom: 6px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.primary.lightBlue};
    color: white;
  }
`;

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  // Prefer logo3.png; fall back to logo2.png then s.png then fallback badge
  const [logoSrc, setLogoSrc] = useState(`${process.env.PUBLIC_URL || ''}/logo3.png`);

  const onLogoError = () => {
    // Fallback chain: logo3 -> logo2 -> s -> badge
    const publicUrl = process.env.PUBLIC_URL || '';
    if (logoSrc.endsWith('/logo3.png')) {
      setLogoSrc(`${publicUrl}/logo2.png`);
      return;
    }
    if (logoSrc.endsWith('/logo2.png')) {
      setLogoSrc(`${publicUrl}/s.png`);
      return;
    }
    setLogoError(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (user?.email) {
        try {
          const adminsCol = collection(db, 'admins');
          const q = query(adminsCol, where('email', '==', user.email));
          const snap = await getDocs(q);
          setIsAdmin(!snap.empty);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const navItems = isAdmin ? [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/patients', label: 'Patients' },
    { path: '/admin/bookings', label: 'Bookings' },
    { path: '/admin/files', label: 'Files' },
    { path: '/admin/reports', label: 'Reports' }
  ] : isAuthenticated ? [
    { path: '/dashboard', label: 'My Dashboard' },
    { path: '/services', label: 'Our Services' },
    { path: '/appointment', label: 'Appointment' },
    { path: '/filing', label: 'Filing' },
    { path: '/payment', label: 'Payments' },
    { path: '/contact', label: 'Contact Us' }
  ] : [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Our Services' },
    { path: '/payment', label: 'Payments' },
    { path: '/contact', label: 'Contact Us' }
  ];

  return (
    <HeaderContainer>
      <Inner>
        <LeftSection style={{ gap: 40 }}>
          {/* Only render logo and nav once */}
          <Brand to="/" aria-label="Home">
            {!logoError ? (
              <BrandAvatar>
                <BrandLogo
                  src={logoSrc}
                  alt="Healthwise logo"
                  loading="eager"
                  decoding="sync"
                  style={{ filter: 'none', imageRendering: 'auto' }}
                  onError={onLogoError}
                />
              </BrandAvatar>
            ) : (
              <BrandFallback>S</BrandFallback>
            )}
          </Brand>
          <NavWrapper>
            <Nav>
              {navItems.map(item => (
                <NavLink key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                  {item.label}
                </NavLink>
              ))}
            </Nav>
          </NavWrapper>
        </LeftSection>
        <div style={{ flex: 1 }} />
        <Actions>
          {isAuthenticated ? (
            <UserMenu>
              {isAdmin && (
                <AdminLink to="/admin/dashboard">
                  <FaUserMd /> Admin Portal
                </AdminLink>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaUser /> {user?.name}
              </span>
              <LogoutBtn onClick={handleLogout} title="Logout">
                <FaSignOutAlt /> Logout
              </LogoutBtn>
            </UserMenu>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          <MobileToggle onClick={() => setMobileMenuOpen(v => !v)} aria-label="Toggle menu">
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileToggle>
        </Actions>
      </Inner>

      {mobileMenuOpen && (
        <MobileNav>
          {navItems.map(item => (
            <MobileNavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </MobileNavLink>
          ))}

          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
        </MobileNav>
      )}
    </HeaderContainer>
  );
};

export default Header;