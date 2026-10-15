import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const FooterWrap = styled.footer`
  background: ${theme.colors.primary.skyBlue};
  color: white;
  padding: 40px 0 12px; /* reduced top padding to shorten footer height */
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ScrollToTop = styled.button`
  position: absolute;
  top: 15px;
  right: 30px;
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary.darkBlue};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: white;
    color: ${theme.colors.primary.darkBlue};
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 16px;
    top: 12px;
    right: 20px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 25px;
  margin-bottom: 15px;
  margin-top: 32px; /* added top margin to drop the entire content grid lower */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* align logo and text to the left */
  gap: 8px;
  padding-top: 0; /* removed padding to reduce footer height */

  @media (max-width: 768px) {
    padding-top: 0;
    align-items: center; /* center on mobile */
  }
`;

const Description = styled.p`
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.9;
  margin: 0;
  text-align: left; /* align description text to the left */

  @media (max-width: 768px) {
    text-align: center; /* center on mobile */
  }
`;

// Circular avatar wrapper to trim edges and keep the logo perfectly round
const FooterAvatar = styled.div`
  width: 112px;
  height: 112px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  
  @media (max-width: 768px) {
    width: 88px;
    height: 88px;
  }
`;

const FooterLogo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover; /* avoid stretching, fill circle */
  object-position: center;
  display: block;
  border: 0;
  outline: none;
  box-shadow: none;
  background: transparent;
`;
const LinksSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 12px; /* tighter horizontal space between the columns (Quick Links vs Services) */
  row-gap: 20px;    /* keep comfortable vertical spacing */
  margin-top: 24px; /* reduced top margin to shorten overall footer height */
  justify-items: end; /* align Quick Links to the right */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    column-gap: 0;   /* single column layout, horizontal gap not needed */
    row-gap: 12px;   /* compact vertical spacing on mobile */
    margin-top: 16px;
    justify-items: start; /* reset alignment on mobile */
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px; /* tighter spacing between links */
`;

const LinkTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  opacity: 0.95;

  &::after {
    content: '';
    display: block;
    width: 28px;
    height: 2px;
    background: rgba(255,255,255,0.25);
    border-radius: 2px;
    margin-top: 6px;
  }
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 12px;
  line-height: 1.25; /* reduce vertical line height for a tighter stack */
  opacity: 0.85;
  transition: color 0.2s ease, opacity 0.2s ease, text-decoration-color 0.2s ease;

  &:hover {
    opacity: 1;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: rgba(255,255,255,0.8);
  }
`;

const ContactInfo = styled.p`
  font-size: 12px;
  margin: 0 0 8px;
  opacity: 0.95;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  span:first-child {
    font-size: 14px;
    min-width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span:last-child {
    flex: 1;
    font-weight: 300;
    letter-spacing: 0.3px;
  }
`;

const Bottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.12);
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 12px;
  opacity: 0.7;
  margin: 0;
`;

const Social = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.span`
  font-size: 12px;
  opacity: 0.7;
  cursor: pointer;
`;

const Footer = () => {
  const [footerLogoSrc, setFooterLogoSrc] = useState(`${process.env.PUBLIC_URL || ''}/logo3.png`);
  const [footerLogoError, setFooterLogoError] = useState(false);

  const onFooterLogoError = () => {
    const publicUrl = process.env.PUBLIC_URL || '';
    // Fallback chain: logo3 -> logo2 -> s -> hide
    if (footerLogoSrc.endsWith('/logo3.png')) {
      setFooterLogoSrc(`${publicUrl}/logo2.png`);
      return;
    }
    if (footerLogoSrc.endsWith('/logo2.png')) {
      setFooterLogoSrc(`${publicUrl}/s.png`);
      return;
    }
    setFooterLogoError(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <FooterWrap>
      <ScrollToTop onClick={scrollToTop} aria-label="Scroll to top">
        ↑
      </ScrollToTop>
      
      <Container>
        <ContentGrid>
          <LogoSection>
            {!footerLogoError && (
              <FooterAvatar>
                <FooterLogo
                  src={footerLogoSrc}
                  alt="Healthwise logo"
                  loading="eager"
                  decoding="sync"
                  onError={onFooterLogoError}
                />
              </FooterAvatar>
            )}
            <Description>
              Your trusted healthcare partner, providing quality medical services with compassion and excellence.
            </Description>
          </LogoSection>

          <LinksSection>
            <LinkGroup>
              <LinkTitle>Quick Links</LinkTitle>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/services">Our Services</FooterLink>
              <FooterLink to="/appointment">Book Appointment</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </LinkGroup>

            <LinkGroup>
              <LinkTitle>Services</LinkTitle>
              <FooterLink to="/services">General Consultation</FooterLink>
              <FooterLink to="/services">Specialist Care</FooterLink>
              <FooterLink to="/services">Emergency Care</FooterLink>
              <FooterLink to="/services">Laboratory Tests</FooterLink>
            </LinkGroup>

            <LinkGroup>
              <LinkTitle>Contact Info</LinkTitle>
              <ContactInfo>
                <span>📧</span>
                <span>
                  <strong style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>Email</strong>
                  info@healthwise.clinic
                </span>
              </ContactInfo>
              <ContactInfo>
                <span>📞</span>
                <span>
                  <strong style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>Phone</strong>
                  +27 11 253 4567
                </span>
              </ContactInfo>
              <ContactInfo>
                <span>📍</span>
                <span>
                  <strong style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>Address</strong>
                  247 Oxford Road, Rosebank<br/>
                  Johannesburg, South Africa
                </span>
              </ContactInfo>
              <ContactInfo>
                <span>⏰</span>
                <span>
                  <strong style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>Hours</strong>
                  Mon-Fri: 07:00 - 18:00<br/>
                  Saturday: 08:00 - 13:00
                </span>
              </ContactInfo>
            </LinkGroup>
          </LinksSection>
        </ContentGrid>

        <Bottom>
          <Copyright>© 2025 Healthwise Clinic. All rights reserved.</Copyright>
          <Social>
            <SocialLink>Privacy Policy</SocialLink>
            <SocialLink>Terms of Service</SocialLink>
            <SocialLink>Contact</SocialLink>
          </Social>
        </Bottom>
      </Container>
    </FooterWrap>
  );
};

export default Footer;