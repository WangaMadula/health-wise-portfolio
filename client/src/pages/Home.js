import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import '../styles/home.css';
import '../styles/services-parallax.css';
import { FaCalendarAlt, FaUserMd, FaFileAlt, FaHeartbeat, FaAmbulance, FaFlask } from 'react-icons/fa';
import HealthChatBot from '../components/HealthChatBot';

const Home = () => {
  const { isAuthenticated } = useAuth();
  // Parallax offset and button interaction states
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [primaryActive, setPrimaryActive] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);
  const [secondaryActive, setSecondaryActive] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      // Gentle parallax factor
      const y = window.scrollY || 0;
      setParallaxOffset(-(y * 0.25));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          } else {
            setStatsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Build hero background via Object.assign at render time (hard-code encoded public path)
  const heroBackground = {
    backgroundImage: 'url("/Doctor-with-mum-and-daughter-1-2.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: `center ${parallaxOffset}px`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={Object.assign({}, styles.hero, heroBackground)}>
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Your Health, Our Priority
            </h1>
            <p style={styles.heroSubtitle}>
              Experience exceptional healthcare services at Healthwise Clinic. 
              We provide comprehensive medical care with compassion, expertise, 
              and cutting-edge technology.
            </p>
            <div style={styles.heroActions}>
              {isAuthenticated ? (
                <>
                  <Link to="/appointment" style={styles.primaryBtn}>
                    Book Appointment
                  </Link>
                  <Link to="/filing" style={styles.secondaryBtn}>
                    File Documents
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    style={Object.assign({}, styles.primaryBtn, primaryHover ? styles.primaryBtnHover : null, primaryActive ? styles.primaryBtnActive : null)}
                    onMouseEnter={() => setPrimaryHover(true)}
                    onMouseLeave={() => { setPrimaryHover(false); setPrimaryActive(false); }}
                    onMouseDown={() => setPrimaryActive(true)}
                    onMouseUp={() => setPrimaryActive(false)}
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/contact"
                    style={styles.secondaryBtn}
                  >
                    Contact Us
                  </Link>
                </>
              )}
            </div>
            {/* ...existing code... */}
          </div>
        </div>
      </section>

      {/* Admin Access Section - removed per request */}

      {/* Services Overview */}
      <section style={styles.services}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <div style={styles.servicesUnderline}></div>
          <p style={styles.sectionSubtitle}>
            Comprehensive healthcare solutions tailored to your needs
          </p>
          
          <div style={styles.servicesGrid}>
            <div className="service-card">
              <FaUserMd className="service-icon" />
              <h3 className="service-title">General Consultation</h3>
              <p className="service-description">
                Expert medical consultation for all your health concerns with experienced doctors.
              </p>
            </div>

            <div className="service-card">
              <FaHeartbeat className="service-icon" />
              <h3 className="service-title">Specialist Care</h3>
              <p className="service-description">
                Specialized medical care across various fields including cardiology, dermatology, and more.
              </p>
            </div>

            <div className="service-card">
              <FaAmbulance className="service-icon" />
              <h3 className="service-title">Emergency Care</h3>
              <p className="service-description">
                24/7 emergency medical services with rapid response and critical care capabilities.
              </p>
            </div>

            <div className="service-card">
              <FaFlask className="service-icon" />
              <h3 className="service-title">Laboratory Tests</h3>
              <p className="service-description">
                Comprehensive laboratory testing with accurate results and quick turnaround times.
              </p>
            </div>

            <div className="service-card">
              <FaCalendarAlt className="service-icon" />
              <h3 className="service-title">Medical Check-ups</h3>
              <p className="service-description">
                Regular health screenings and preventive care to keep you healthy and informed.
              </p>
            </div>

            <div className="service-card">
              <FaFileAlt className="service-icon" />
              <h3 className="service-title">Medical Records</h3>
              <p className="service-description">
                Secure digital medical records management and easy access to your health history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div className="container" style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <div style={styles.ctaUnderline}></div>
          <p style={styles.ctaText}>
            Join thousands of satisfied patients who trust Healthwise Clinic for their healthcare needs.
          </p>
          <div style={styles.ctaActions}>
            <Link to="/register" className="btn btn-primary" style={styles.ctaBtn}>
              Create Account
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats} ref={statsRef}>
        <div className="container">
          <h2 style={styles.statsHeading}>Our Stats</h2>
          <div style={styles.statsUnderline}></div>
          <p style={styles.statsSubtitle}>Trusted by thousands, backed by excellence</p>
          <div style={styles.statsGrid}>
            <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'}>
              <h3 style={styles.statNumber}>5000+</h3>
              <p style={styles.statLabel}>Happy Patients</p>
            </div>
            <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'}>
              <h3 style={styles.statNumber}>50+</h3>
              <p style={styles.statLabel}>Expert Doctors</p>
            </div>
            <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'}>
              <h3 style={styles.statNumber}>15+</h3>
              <p style={styles.statLabel}>Years Experience</p>
            </div>
            <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'}>
              <h3 style={styles.statNumber}>24/7</h3>
              <p style={styles.statLabel}>Emergency Care</p>
            </div>
          </div>
        </div>
      </section>

      {/** Image gallery removed per request; hero section now uses the background image */}
      <HealthChatBot />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    background: '#ffffff'
  },
  hero: {
    padding: '80px 0',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    // Pull the hero up under the transparent, sticky navbar so no white gap shows
    marginTop: `-${theme.sizes.header}`,
    paddingTop: `calc(80px + ${theme.sizes.header})`
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    // Responsive: move to CSS or styled-components
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 1.1,
    margin: 0,
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#ffffff',
    lineHeight: 1.6,
    margin: 0,
    textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
  },
  heroActions: {
    display: 'flex',
    gap: '15px',
    // Responsive: move to CSS or styled-components
  },
  heroImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroImagePlaceholder: {
    width: '300px',
    height: '300px',
    background: `linear-gradient(135deg, ${theme.colors.primary.mediumBlue}, ${theme.colors.purple.medium})`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.xl
  },
  heroIcon: {
    fontSize: '100px',
    color: 'white'
  },
  adminAccess: {
    padding: '60px 0',
    background: `linear-gradient(135deg, ${theme.colors.primary.darkBlue} 0%, ${theme.colors.secondary.purple} 100%)`
  },
  adminCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '600px',
    margin: '0 auto'
  },
  adminCardIcon: {
    fontSize: '60px',
    color: theme.colors.secondary.purple,
    marginBottom: '20px'
  },
  adminCardContent: {
    color: 'white'
  },
  adminCardTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '15px',
    color: 'white'
  },
  adminCardText: {
    fontSize: '16px',
    marginBottom: '30px',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  adminActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  },
  adminLoginBtn: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '600',
    background: `linear-gradient(135deg, ${theme.colors.secondary.purple} 0%, ${theme.colors.primary.lightBlue} 100%)`,
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(168, 85, 247, 0.4)'
    }
  },
  demoCredentials: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  demoText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  services: {
    padding: '80px 0',
    background: 'linear-gradient(180deg, rgba(49,130,206,0.06) 0%, rgba(49,130,206,0.10) 100%)'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: theme.colors.primary.darkBlue,
    textAlign: 'center',
    margin: '0 0 20px'
  },
  servicesUnderline: {
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.colors.primary.skyBlue}, ${theme.colors.primary.darkBlue})`,
    margin: '0 auto 20px',
    borderRadius: '2px'
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: theme.colors.secondary.gray,
    textAlign: 'center',
    marginBottom: '50px',
    margin: '0 0 50px'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
  },
  serviceCard: {
    textAlign: 'center',
    padding: '40px 30px',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
  serviceIcon: {
    fontSize: '48px',
    color: theme.colors.primary.lightBlue,
    marginBottom: '20px'
  },
  serviceTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.primary.darkBlue,
    margin: '0 0 15px'
  },
  serviceDescription: {
    fontSize: '16px',
    color: theme.colors.secondary.gray,
    lineHeight: 1.6,
    margin: 0
  },
  stats: {
    padding: '80px 0',
    background: '#ffffff',
    color: theme.colors.primary.darkBlue
  },
  statsHeading: {
    fontSize: '42px',
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.primary.darkBlue,
    margin: '0 0 20px',
    letterSpacing: '-0.5px'
  },
  statsUnderline: {
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.colors.primary.skyBlue}, ${theme.colors.primary.darkBlue})`,
    margin: '0 auto 20px',
    borderRadius: '2px'
  },
  statsSubtitle: {
    fontSize: '18px',
    textAlign: 'center',
    color: theme.colors.secondary.gray,
    margin: '0 0 50px',
    fontWeight: '400'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 10px',
    color: theme.colors.primary.darkBlue
  },
  statLabel: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0
  },
  cta: {
    padding: '80px 0 120px',
    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(155, 89, 182, 0.05) 100%)'
  },
  ctaContent: {
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px'
  },
  ctaTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: theme.colors.primary.darkBlue,
    margin: '0 0 20px',
    letterSpacing: '-0.5px'
  },
  ctaUnderline: {
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.colors.primary.skyBlue}, ${theme.colors.primary.darkBlue})`,
    margin: '0 auto 25px',
    borderRadius: '2px'
  },
  ctaText: {
    fontSize: '22px',
    color: theme.colors.secondary.gray,
    margin: '0 0 45px',
    lineHeight: '1.6',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  ctaActions: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    // Responsive: move to CSS or styled-components
  },
  ctaBtn: {
    padding: '18px 45px',
    fontSize: '18px',
    fontWeight: '600'
  },
  primaryBtn: {
    padding: '15px 35px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `2px solid ${theme.colors.primary.skyBlue}`,
    borderRadius: '8px',
    color: '#ffffff',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'inline-block',
    textShadow: '1px 1px 2px rgba(0,0,0,0.25)',
    boxShadow: '0 6px 18px rgba(99, 179, 237, 0.25)'
  },
  primaryBtnHover: {
    boxShadow: '0 12px 30px rgba(99, 179, 237, 0.45)',
    transform: 'translateY(-2px)'
  },
  primaryBtnActive: {
    transform: 'scale(0.98)'
  },
  secondaryBtn: {
    padding: '15px 35px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'transparent',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    color: '#ffffff',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'inline-block',
    textShadow: '1px 1px 2px rgba(0,0,0,0.25)',
    boxShadow: '0 6px 18px rgba(255, 255, 255, 0.18)'
  },
  secondaryBtnHover: {
    boxShadow: '0 12px 30px rgba(255, 255, 255, 0.35)',
    transform: 'translateY(-2px)'
  },
  secondaryBtnActive: {
    transform: 'scale(0.98)'
  }
};

export default Home;