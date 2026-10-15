
import React, { useEffect, useRef, useState } from 'react';
import { FaUsers, FaCalendarAlt, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const HeroSection = styled.div`
  min-height: 480px;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/Doctor-with-mum-and-daughter-1-2.jpg');
  background-size: cover;
  background-position: 50% 38%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  margin-top: -24px !important;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 24px rgba(30,60,114,0.08);
  padding-top: 0 !important;
  z-index: 2;
`;



const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 60%, #e0e7ff 100%);
  padding-bottom: 3rem;
`;

const FeatureIcon = styled.div`
  color: #1e3c72;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
`;



const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  padding: 2.5rem 1.5rem 2rem;
  width: 100%;
  max-width: 900px;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    letter-spacing: -1px;
    text-shadow: 0 4px 24px rgba(0,0,0,0.25);
  }
  p {
    font-size: 1.15rem;
    color: #e0e7ef;
    text-shadow: 0 2px 12px rgba(0,0,0,0.18);
    margin: 0 auto;
    max-width: 600px;
  }
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;


const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem 3rem;
  margin-bottom: 2.5rem;
  justify-items: stretch;
`;

const FeatureSection = styled.section`
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 24px rgba(30,60,114,0.08);
  border-radius: 18px;
  padding: 2.2rem 2rem 1.7rem 2rem;
  width: 100%;
  min-width: 0;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  transition: box-shadow 0.25s, transform 0.22s, background 0.22s;
  cursor: pointer;
  border: 1.5px solid #e6eaf5;

  &:hover {
    box-shadow: 0 12px 36px 0 rgba(30,60,114,0.16), 0 2.5px 12px 0 rgba(168,85,247,0.13);
    background: linear-gradient(135deg, #f0f7ff 40%, #e0e7ff 100%);
    transform: translateY(-4px) scale(1.025);
    border-color: #a855f7;
  }
`;


const FeatureHeading = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 0.15rem;
  letter-spacing: -0.5px;
`;

const FeatureSubheading = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #4f5d75;
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  font-size: 0.98rem;
  color: #2a3b5d;
  margin-bottom: 0;
`;



const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
`;

const StatCard = styled.div`
  text-align: center;
  
  .number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #a855f7;
    background: linear-gradient(135deg, #a855f7 40%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    filter: drop-shadow(0 2px 8px rgba(168,85,247,0.10));
    display: block;
  }
  
  .label {
    font-size: 1rem;
    opacity: 0.9;
    margin-top: 0.5rem;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('dashboard-stats-anim')) {
      const style = document.createElement('style');
      style.id = 'dashboard-stats-anim';
      style.innerHTML = `
        .stat-item-animate { opacity: 1; transform: translateY(0); transition: opacity 0.7s, transform 0.7s; }
        .stat-item-hidden { opacity: 0; transform: translateY(40px); transition: opacity 0.7s, transform 0.7s; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
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
      const ref = statsRef.current;
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, []);

  return (
    <DashboardContainer>
      <HeroSection>
        <HeroContent>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || 'Admin'}! Manage your clinic operations from here.</p>
        </HeroContent>
      </HeroSection>
      <DashboardContent>
        {/* Today's Overview Section with animation and white background */}
        <section ref={statsRef} style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="container">
            <h2 style={{ color: '#a855f7', marginBottom: '2.2rem', textAlign: 'center', fontWeight: 700, fontSize: '1.7rem', letterSpacing: '-0.5px' }}>
              Today's Overview
            </h2>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', gap: '2.2rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
              {/* All stat boxes use the same blue gradient color */}
              <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'} style={{ minWidth: 170, background: 'linear-gradient(135deg, #e0e7ff 80%, #f3e8ff 100%)', borderRadius: 14, boxShadow: '0 2px 16px rgba(168,85,247,0.10)', padding: '1.2rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', border: '2px solid #a855f7' }}>
                <span style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 800, fontSize: '2.7rem', color: '#7c3aed', letterSpacing: '-1px', lineHeight: 1 }}>{'24'}</span>
                <div style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08rem', color: '#5b21b6', marginTop: 8, textAlign: 'center' }}>{"Today's Appointments"}</div>
              </div>
              <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'} style={{ minWidth: 170, background: 'linear-gradient(135deg, #e0e7ff 80%, #f3e8ff 100%)', borderRadius: 14, boxShadow: '0 2px 16px rgba(168,85,247,0.10)', padding: '1.2rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', border: '2px solid #a855f7' }}>
                <span style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 800, fontSize: '2.7rem', color: '#7c3aed', letterSpacing: '-1px', lineHeight: 1 }}>{'156'}</span>
                <div style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08rem', color: '#5b21b6', marginTop: 8, textAlign: 'center' }}>{'Total Patients'}</div>
              </div>
              <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'} style={{ minWidth: 170, background: 'linear-gradient(135deg, #e0e7ff 80%, #f3e8ff 100%)', borderRadius: 14, boxShadow: '0 2px 16px rgba(168,85,247,0.10)', padding: '1.2rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', border: '2px solid #a855f7' }}>
                <span style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 800, fontSize: '2.7rem', color: '#7c3aed', letterSpacing: '-1px', lineHeight: 1 }}>{'12'}</span>
                <div style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08rem', color: '#5b21b6', marginTop: 8, textAlign: 'center' }}>{'Pending Files'}</div>
              </div>
              <div className={statsVisible ? 'stat-item-animate' : 'stat-item-hidden'} style={{ minWidth: 170, background: 'linear-gradient(135deg, #e0e7ff 80%, #f3e8ff 100%)', borderRadius: 14, boxShadow: '0 2px 16px rgba(168,85,247,0.10)', padding: '1.2rem 1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', border: '2px solid #a855f7' }}>
                <span style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 800, fontSize: '2.7rem', color: '#7c3aed', letterSpacing: '-1px', lineHeight: 1 }}>{'R 12,500'}</span>
                <div style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08rem', color: '#5b21b6', marginTop: 8, textAlign: 'center' }}>{"Today's Revenue"}</div>
              </div>
            </div>
          </div>
        </section>
        <h2 style={{ color: '#1e3c72', marginBottom: '1.2rem', marginTop: '2.5rem', fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.5px', textAlign: 'center' }}>
          Admin Features
        </h2>
        <SectionGrid>
          <FeatureSection>
            <FeatureIcon><FaUsers /></FeatureIcon>
            <FeatureHeading>Patients</FeatureHeading>
            <FeatureSubheading>Manage Patient Records</FeatureSubheading>
            <FeatureText>View and manage patient records, medical history, and personal information.</FeatureText>
          </FeatureSection>
          <FeatureSection>
            <FeatureIcon><FaCalendarAlt /></FeatureIcon>
            <FeatureHeading>Bookings</FeatureHeading>
            <FeatureSubheading>Appointments & Scheduling</FeatureSubheading>
            <FeatureText>Manage appointments, schedules, and booking confirmations.</FeatureText>
          </FeatureSection>
          <FeatureSection>
            <FeatureIcon><FaChartBar /></FeatureIcon>
            <FeatureHeading>Analytics</FeatureHeading>
            <FeatureSubheading>Clinic Performance & Reports</FeatureSubheading>
            <FeatureText>View clinic performance, revenue reports, and statistical insights.</FeatureText>
          </FeatureSection>
          <FeatureSection>
            <FeatureIcon><FaFileAlt /></FeatureIcon>
            <FeatureHeading>Documents</FeatureHeading>
            <FeatureSubheading>Patient Files & Claims</FeatureSubheading>
            <FeatureText>Review patient files, medical documents, and insurance claims.</FeatureText>
          </FeatureSection>
        </SectionGrid>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
