import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import { FaUserMd, FaHeartbeat, FaAmbulance, FaFlask, FaCalendarAlt, FaStethoscope, FaClock, FaCheckCircle } from 'react-icons/fa';
import { formatCurrency } from '../utils/api';
import '../styles/services.css';

const Services = () => {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setParallaxOffset(-(y * 0.25));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

const services = [
        {
          id: 1,
          icon: <FaUserMd />,
          title: 'General Consultation',
          description: 'Comprehensive primary healthcare services for all ages, including routine check-ups, health screenings, and treatment of common medical conditions.',
          features: ['Health Assessment', 'Preventive Care', 'Treatment Plans', 'Health Education'],
          price: `From ${formatCurrency(1075)}`
        },
        {
          id: 2,
          icon: <FaHeartbeat />,
          title: 'Specialist Consultation',
          description: 'Expert care from specialized doctors across various medical fields including cardiology, dermatology, gynecology, and more.',
          features: ['Expert Diagnosis', 'Advanced Treatment', 'Follow-up Care', 'Referral Services'],
          price: `From ${formatCurrency(1150)}`
        },
        {
          id: 3,
          icon: <FaCalendarAlt />,
          title: 'Medical Check-up',
          description: 'Comprehensive health screenings and annual physical examinations to maintain optimal health and prevent diseases.',
          features: ['Full Body Check-up', 'Blood Tests', 'Health Reports', 'Lifestyle Guidance'],
          price: `From ${formatCurrency(1200)}`
        },
        {
          id: 4,
          icon: <FaStethoscope />,
          title: 'Vaccination',
          description: 'Complete vaccination services for children and adults, including travel vaccines and immunization schedules.',
          features: ['Child Immunization', 'Adult Vaccines', 'Travel Vaccines', 'Health Certificates'],
          price: `From ${formatCurrency(1050)}`
        },
        {
          id: 5,
          icon: <FaFlask />,
          title: 'Laboratory Tests',
          description: 'State-of-the-art diagnostic laboratory services with accurate results and quick turnaround times.',
          features: ['Blood Tests', 'Urine Analysis', 'Imaging Services', 'Quick Results'],
          price: `From ${formatCurrency(1030)}`
        },
        {
          id: 6,
          icon: <FaAmbulance />,
          title: 'Emergency Care',
          description: '24/7 emergency medical services with experienced medical staff and advanced life support capabilities.',
          features: ['24/7 Availability', 'Critical Care', 'Trauma Treatment', 'Ambulance Service'],
          price: 'Emergency Rates Apply'
        }
      ];

const headerBackground = {
        backgroundImage: 'url("/Doctor-with-mum-and-daughter-1-2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: `center ${parallaxOffset}px`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };

const ctaBackground = {
        backgroundImage: 'url("/teamcenturion_cover.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 0px',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };

  return (
        <div style={styles.container}>
          {/* Header Section */}
          <section style={Object.assign({}, styles.header, headerBackground)}>
            <div className="container">
              <h1 style={styles.pageTitle}>Our Medical Services</h1>
              <p style={styles.pageSubtitle}>
                Comprehensive healthcare services delivered with excellence and compassion
              </p>
            </div>
          </section>

          {/* Services Grid */}
          <section style={styles.servicesSection}>
            <div className="container">
              <h2 style={styles.featuredTitle}>Featured Services</h2>
              <div style={styles.featuredUnderline}></div>
          
              <div style={styles.servicesGrid}>
                {services.map((service) => (
                  <div key={service.id} className="card service-card" style={styles.serviceCard}>
                    <div style={styles.serviceHeader}>
                      <div className="service-icon" style={styles.serviceIcon}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 style={styles.serviceTitle}>{service.title}</h3>
                        <p style={styles.servicePrice}>{service.price}</p>
                      </div>
                    </div>
                
                    <p style={styles.serviceDescription}>
                      {service.description}
                    </p>
                
                    <div style={styles.featuresSection}>
                      <h4 style={styles.featuresTitle}>What's Included:</h4>
                      <ul style={styles.featuresList}>
                        {service.features.map((feature, index) => (
                          <li key={index} style={styles.featureItem}>
                            <FaCheckCircle style={styles.checkIcon} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link 
                      to="/appointment" 
                      className="btn btn-primary" 
                      style={styles.bookBtn}
                    >
                      Book Appointment
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section style={styles.whyChooseUs}>
            <div className="container">
              <h2 style={styles.sectionTitle}>Why Choose Healthwise Clinic?</h2>
              <div style={styles.sectionUnderline}></div>
          
              <div style={styles.benefitsGrid}>
                <div className="benefit-card" style={styles.benefitItem}>
                  <FaClock style={styles.benefitIcon} />
                  <h3 style={styles.benefitTitle}>Convenient Scheduling</h3>
                  <p style={styles.benefitDescription}>
                    Easy online booking with flexible appointment times that fit your schedule.
                  </p>
                </div>
            
                <div className="benefit-card" style={styles.benefitItem}>
                  <FaUserMd style={styles.benefitIcon} />
                  <h3 style={styles.benefitTitle}>Expert Medical Staff</h3>
                  <p style={styles.benefitDescription}>
                    Highly qualified doctors and healthcare professionals with years of experience.
                  </p>
                </div>
            
                <div className="benefit-card" style={styles.benefitItem}>
                  <FaHeartbeat style={styles.benefitIcon} />
                  <h3 style={styles.benefitTitle}>Comprehensive Care</h3>
                  <p style={styles.benefitDescription}>
                    Complete healthcare solutions from preventive care to specialized treatments.
                  </p>
                </div>
            
                <div className="benefit-card" style={styles.benefitItem}>
                  <FaStethoscope style={styles.benefitIcon} />
                  <h3 style={styles.benefitTitle}>Modern Facilities</h3>
                  <p style={styles.benefitDescription}>
                    State-of-the-art medical equipment and comfortable, modern facilities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={Object.assign({}, styles.cta, ctaBackground)}>
            <div className="container" style={styles.ctaContent}>
              <h2 style={styles.ctaTitle}>Ready to Book Your Appointment?</h2>
              <p style={styles.ctaText}>
                Take the first step towards better health. Our medical professionals are ready to help you.
              </p>
              <div style={styles.ctaActions}>
                <Link to="/appointment" className="btn btn-primary" style={styles.ctaBtn}>
                  Book Appointment
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      );
};

const customGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '30px',
  margin: '0 auto',
  maxWidth: '1400px',
};

const customCardStyle = {
  minHeight: '420px',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(30,60,114,0.07)',
};

const styles = {
      container: {
        width: '100%'
      },
      header: {
        padding: '120px 0',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        marginTop: `-${theme.sizes.header}`,
        paddingTop: `calc(120px + ${theme.sizes.header})`
      },
      pageTitle: {
        fontSize: '48px',
        fontWeight: '700',
        color: 'white',
        margin: '0 0 20px',
        textShadow: '2px 2px 8px rgba(0,0,0,0.6)'
      },
      pageSubtitle: {
        fontSize: '20px',
        color: 'white',
        margin: 0,
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textShadow: '1px 1px 6px rgba(0,0,0,0.6)'
      },
      servicesSection: {
        padding: '80px 0',
        background: 'white'
      },
      featuredTitle: {
        fontSize: '36px',
        fontWeight: '700',
        color: theme.colors.primary.darkBlue,
        textAlign: 'center',
        margin: '0 0 20px'
      },
      featuredUnderline: {
        width: '80px',
        height: '4px',
        background: `linear-gradient(90deg, ${theme.colors.primary.skyBlue}, ${theme.colors.primary.darkBlue})`,
        margin: '0 auto 50px',
        borderRadius: '2px'
      },
      servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      },
      serviceCard: {
        padding: '30px',
        transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid transparent',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          borderColor: theme.colors.primary.skyBlue
        }
      },
      serviceHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px'
      },
      serviceIcon: {
        fontSize: '32px',
        color: theme.colors.primary.lightBlue,
        background: theme.colors.primary.paleBlue,
        padding: '15px',
        borderRadius: '50%',
        minWidth: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      },
      serviceTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: theme.colors.primary.darkBlue,
        margin: '0 0 5px'
      },
      servicePrice: {
        fontSize: '14px',
        color: theme.colors.purple.medium,
        fontWeight: '600',
        margin: 0
      },
      serviceDescription: {
        fontSize: '16px',
        color: theme.colors.secondary.gray,
        lineHeight: 1.6,
        marginBottom: '20px',
        flex: 1
      },
      featuresSection: {
        marginBottom: '25px'
      },
      featuresTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: theme.colors.primary.darkBlue,
        margin: '0 0 15px'
      },
      featuresList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
      },
      featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
        fontSize: '14px',
        color: theme.colors.secondary.gray
      },
      checkIcon: {
        color: theme.colors.status.success,
        fontSize: '12px'
      },
      bookBtn: {
        width: '100%',
        padding: '12px',
        textAlign: 'center'
      },
      whyChooseUs: {
        padding: '60px 0',
        background: `linear-gradient(180deg, ${theme.colors.secondary.white} 0%, ${theme.colors.primary.paleBlue} 100%)`
      },
      sectionTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: theme.colors.primary.darkBlue,
        textAlign: 'center',
        margin: '0 0 20px'
      },
      sectionUnderline: {
        width: '80px',
        height: '4px',
        background: `linear-gradient(90deg, ${theme.colors.primary.skyBlue}, ${theme.colors.primary.darkBlue})`,
        margin: '0 auto 35px',
        borderRadius: '2px'
      },
      benefitsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      },
      benefitItem: {
        textAlign: 'center',
        background: theme.colors.secondary.white,
        borderRadius: theme.sizes.borderRadius,
        padding: '24px',
        boxShadow: theme.shadows.md,
        border: `1px solid ${theme.colors.secondary.lightGray}`
      },
      benefitIcon: {
        fontSize: '36px',
        color: theme.colors.primary.mediumBlue,
        background: theme.colors.primary.paleBlue,
        borderRadius: '50%',
        width: '72px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      },
      benefitTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: theme.colors.primary.darkBlue,
        margin: '0 0 15px'
      },
      benefitDescription: {
        fontSize: '16px',
        color: theme.colors.secondary.gray,
        lineHeight: 1.6,
        margin: 0
      },
      cta: {
        padding: '60px 0',
        minHeight: '420px',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      ctaContent: {
        textAlign: 'center'
      },
      ctaTitle: {
        fontSize: '36px',
        fontWeight: '700',
        margin: '0 0 20px',
        textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
      },
      ctaText: {
        fontSize: '20px',
        opacity: 0.95,
        margin: '0 0 35px',
        textShadow: '1px 1px 6px rgba(0,0,0,0.8)'
      },
      ctaActions: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        '@media (max-width: 480px)': {
          flexDirection: 'column',
          alignItems: 'center'
        }
      },
      ctaBtn: {
        padding: '15px 30px',
        fontSize: '16px'
      }
    };

export default Services;
