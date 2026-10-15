import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiUsers, FiFileText, FiAlertCircle, FiHeart, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { formatCurrency } from '../utils/api';
import HealthChatBot from '../components/HealthChatBot';
// Main dashboard container
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f3f4f6;
  min-height: 100vh;
`;

// Modal for cancellation reason
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem 1.5rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(30,60,114,0.13);
`;

const ActionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => props.color || '#e5e7eb'};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  h3 {
    color: ${props => props.color || '#374151'};
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  p {
    color: #6b7280;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.2);
  margin-bottom: 2rem;
  text-align: center;
  
  h2 {
    color: #1e3a8a;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #64748b;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-left: 4px solid ${props => props.color || '#3b82f6'};
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.color || '#3b82f6'};
    margin: 0;
  }
  
  .stat-label {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0.5rem 0 0 0;
  }
  
  .stat-change {
    font-size: 0.8rem;
    color: #059669;
    margin-top: 0.25rem;
  }
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    color: #1e3a8a;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.05);
  margin-bottom: 0.5rem;
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.iconColor || '#3b82f6'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-title {
      font-weight: 500;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    
    .activity-time {
      color: #6b7280;
      font-size: 0.8rem;
      margin: 0;
    }
  }
`;

const HealthTips = styled.div`
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }
  
  .tip {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// New styled blocks for portal overview
const PortalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const PortalCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid rgba(168,85,247,0.12);
`;

const SmallMuted = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
`;

const ServicesMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const MiniService = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeroSection = styled.section`
  background: #fff;
  padding: 2rem 0 1rem 0;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const HeroText = styled.div`
  text-align: left;
  h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
  p { color: #64748b; }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0 0 1rem 0;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const ProfileCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const EditButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  color: #1e3a8a;
  font-weight: 500;
  cursor: pointer;
  &[variant='save'] { background: #059669; color: #fff; }
  &[variant='cancel'] { background: #dc2626; color: #fff; }
`;

const ProfileSection = styled.section`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const ProfileField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #1f2937;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  min-height: 60px;
`;

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // Cancel appointment handler
  const handleCancelClick = (apptId) => {
    setCancelId(apptId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }
    setLoadingCancel(true);
    try {
      const apptRef = doc(db, 'appointments', cancelId);
      await updateDoc(apptRef, { status: 'cancelled', reason: cancelReason });
      toast.success("Appointment cancelled.");
      setRecentAppointments(appts => appts.map(a => a.id === cancelId ? { ...a, status: 'cancelled', reason: cancelReason } : a));
      setShowCancelModal(false);
    } catch (e) {
      toast.error("Failed to cancel appointment.");
    } finally {
      setLoadingCancel(false);
    }
  };
  const [filedDocs, setFiledDocs] = useState([]);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: ''
  });

  useEffect(() => {
    if (user && user.profile) {
      setProfileData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        email: user.email || '',
        phone: user.profile.phone || '',
        dateOfBirth: user.profile.dateOfBirth || '',
        address: user.profile.address || '',
        emergencyContact: user.profile.emergencyContact || '',
        medicalHistory: user.profile.medicalHistory || '',
        allergies: user.profile.allergies || '',
        currentMedications: user.profile.currentMedications || ''
      });
    }
    // Load appointments from Firestore
    const fetchAppointments = async () => {
      if (!user?.email) return;
      try {
        const q = query(collection(db, 'appointments'), where('userEmail', '==', user.email));
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecentAppointments(docs);
      } catch (e) {
        setRecentAppointments([]);
      }
    };
    fetchAppointments();
    // Load filed documents from localStorage
    const userFilesKey = `user_files_${user?.uid || user?.email}`;
    const localFiles = JSON.parse(localStorage.getItem(userFilesKey) || '[]');
    setFiledDocs(localFiles);
  }, [user]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset to original data
    if (user && user.profile) {
      setProfileData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        email: user.email || '',
        phone: user.profile.phone || '',
        dateOfBirth: user.profile.dateOfBirth || '',
        address: user.profile.address || '',
        emergencyContact: user.profile.emergencyContact || '',
        medicalHistory: user.profile.medicalHistory || '',
        allergies: user.profile.allergies || '',
        currentMedications: user.profile.currentMedications || ''
      });
    }
  };

  const handleSave = () => {
    // Name/Surname validation: disallow '00'
    if (profileData.firstName.trim() === '00') {
      toast.error("First name cannot be '00'");
      return;
    }
    if (profileData.lastName.trim() === '00') {
      toast.error("Last name cannot be '00'");
      return;
    }
    // Email validation: only allow lowercase letters, up to 3 numbers, must end with @gmail.com, disallow '00@gmail.com'
    const emailRegex = /^[a-z]+\d{0,3}@gmail\.com$/;
    if (profileData.email.trim() === '00@gmail.com' || !emailRegex.test(profileData.email.trim())) {
      toast.error('Email must be lowercase letters (optionally up to 3 numbers) and end with @gmail.com');
      return;
    }
    // Update user profile in localStorage for demo
    const registeredClients = JSON.parse(localStorage.getItem('registeredClients') || '[]');
    const updatedClients = registeredClients.map(client => {
      if (client.user.id === user.id) {
        return {
          ...client,
          user: {
            ...client.user,
            profile: {
              ...client.user.profile,
              ...profileData
            }
          }
        };
      }
      return client;
    });
    
    localStorage.setItem('registeredClients', JSON.stringify(updatedClients));
    localStorage.setItem('demoUser', JSON.stringify({
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    }));
    
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };




  if (!user) {
    return (
      <DashboardContainer>
        <WelcomeMessage>
          <h2>Please log in to access your dashboard</h2>
          <p>You need to be logged in to view your patient dashboard.</p>
        </WelcomeMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <HeroSection>
        <HeroText>
          <h1>Patient Dashboard</h1>
          <p>Welcome, {user.name || 'Patient'}! Manage your health profile and appointments below.</p>
        </HeroText>
      </HeroSection>
      {/* Patient Portal Overview */}
      <PortalGrid>
        <PortalCard>
          <CardTitle style={{ marginBottom: '0.75rem' }}>Next Appointment</CardTitle>
          {recentAppointments && recentAppointments.length > 0 ? (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentAppointments.map(appt => (
                  <div key={appt.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{appt.service}</strong>
                        <SmallMuted>Doctor to be assigned at the clinic</SmallMuted>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>R {appt.amount}</div>
                        <SmallMuted>{appt.date} · {appt.time}</SmallMuted>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      {appt.status !== 'cancelled' && (
                        <button className="btn btn-danger" onClick={() => handleCancelClick(appt.id)}>
                          Cancel Appointment
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => navigate('/appointment')}>Book Another</button>
                      <button className="btn btn-primary" onClick={() => navigate('/services')}>View Services</button>
                    </div>
                    {appt.status === 'cancelled' && appt.reason && (
                      <SmallMuted style={{ color: '#dc2626' }}>Cancelled: {appt.reason}</SmallMuted>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0 }}>You have no appointments yet.</p>
              <SmallMuted>Book your first appointment in a few clicks.</SmallMuted>
              <div style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/appointment')}>Book Appointment</button>
              </div>
            </div>
          )}
          {showCancelModal && (
            <ModalOverlay>
              <ModalBox>
                <h3>Cancel Appointment</h3>
                <label htmlFor="cancel-reason">Reason for cancellation:</label>
                <textarea
                  id="cancel-reason"
                  rows={3}
                  style={{ width: '100%', margin: '0.5rem 0 1rem', borderRadius: 6, border: '1.5px solid #ddd', padding: 8 }}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  disabled={loadingCancel}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)} disabled={loadingCancel}>Close</button>
                  <button className="btn btn-danger" onClick={handleCancelConfirm} disabled={loadingCancel}>
                    {loadingCancel ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                </div>
              </ModalBox>
            </ModalOverlay>
          )}
        </PortalCard>
        <PortalCard>
          <CardTitle style={{ marginBottom: '0.75rem' }}>My Documents</CardTitle>
          <p style={{ margin: 0 }}>
            <strong>{filedDocs.length}</strong> document{filedDocs.length === 1 ? '' : 's'} filed
          </p>
          {filedDocs.length > 0 && (
            <ul style={{ margin: '1rem 0', padding: 0, listStyle: 'none' }}>
              {filedDocs.map((doc, idx) => (
                <li key={doc.name + idx} style={{ marginBottom: 6 }}>
                  <a href={doc.base64} download={doc.name} style={{ color: '#3b82f6', textDecoration: 'underline' }}>{doc.name}</a>
                  <SmallMuted>{doc.fileType} &bull; {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : ''}</SmallMuted>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/filing')}>Upload More</button>
            <button className="btn btn-primary" onClick={() => navigate('/contact')}>Need Help?</button>
          </div>
        </PortalCard>
        <PortalCard>
          <CardTitle>Services at a glance</CardTitle>
          <ServicesMiniGrid>
            <MiniService>
              <FiCalendar color="#3b82f6" />
              <div>
                <div style={{ fontWeight: 600 }}>General Consultation</div>
                <SmallMuted>From {formatCurrency(1250)}</SmallMuted>
              </div>
            </MiniService>
            <MiniService>
              <FiHeart color="#059669" />
              <div>
                <div style={{ fontWeight: 600 }}>Specialist Consultation</div>
                <SmallMuted>From {formatCurrency(1450)}</SmallMuted>
              </div>
            </MiniService>
            <MiniService>
              <FiFileText color="#a855f7" />
              <div>
                <div style={{ fontWeight: 600 }}>Medical Check-up</div>
                <SmallMuted>From {formatCurrency(1350)}</SmallMuted>
              </div>
            </MiniService>
            <MiniService>
              <FiAlertCircle color="#dc2626" />
              <div>
                <div style={{ fontWeight: 600 }}>Emergency Care</div>
                <SmallMuted>24/7</SmallMuted>
              </div>
            </MiniService>
          </ServicesMiniGrid>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/services')}>Explore Services</button>
          </div>
        </PortalCard>
        {/* Clinic Contact */}
        <PortalCard style={{ marginTop: '1.5rem' }}>
          <CardTitle>Clinic Contacts</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Main Reception</strong>
              <SmallMuted>011 253 4567</SmallMuted>
            </div>
            <div>
              <strong>Appointments</strong>
              <SmallMuted>087 550 1234</SmallMuted>
            </div>
            <div>
              <strong>Emergency</strong>
              <SmallMuted>010 911 1234 · 24/7</SmallMuted>
            </div>
            <div>
              <strong>WhatsApp</strong>
              <SmallMuted>+27 72 123 4567</SmallMuted>
            </div>
            <div>
              <strong>Address</strong>
              <SmallMuted>247 Oxford Road, Rosebank Medical Centre, Johannesburg, Gauteng 2196</SmallMuted>
            </div>
            <div>
              <strong>Email</strong>
              <SmallMuted>info@healthwise.clinic</SmallMuted>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/contact')}>Contact Us</button>
          </div>
        </PortalCard>
      </PortalGrid>
      <Card>
        <QuickActions>
          <ActionCard color="#3b82f6" onClick={() => navigate('/appointment')}>
            <FiCalendar size={32} color="#3b82f6" />
            <h3>Book Appointment</h3>
            <p>Schedule a new appointment</p>
          </ActionCard>
          <ActionCard color="#059669" onClick={() => navigate('/services')}>
            <FiFileText size={32} color="#059669" />
            <h3>Our Services</h3>
            <p>View available services</p>
          </ActionCard>
          <ActionCard color="#a855f7" onClick={() => navigate('/filing')}>
            <FiFileText size={32} color="#a855f7" />
            <h3>E-Filing</h3>
            <p>Upload documents</p>
          </ActionCard>
          <ActionCard color="#dc2626" onClick={() => navigate('/contact')}>
            <FiPhone size={32} color="#dc2626" />
            <h3>Contact Us</h3>
            <p>Get in touch</p>
          </ActionCard>
        </QuickActions>
      </Card>
      {/* Health Statistics */}
      <StatsGrid>
        <StatCard color="#3b82f6">
          <div className="stat-number">3</div>
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-change">+1 this month</div>
        </StatCard>
        <StatCard color="#059669">
          <div className="stat-number">12</div>
          <div className="stat-label">Total Visits</div>
          <div className="stat-change">+2 this month</div>
        </StatCard>
        <StatCard color="#a855f7">
          <div className="stat-number">5</div>
          <div className="stat-label">Documents Filed</div>
          <div className="stat-change">+1 this week</div>
        </StatCard>
        <StatCard color="#dc2626">
          <div className="stat-number">98%</div>
          <div className="stat-label">Health Score</div>
          <div className="stat-change">Excellent</div>
        </StatCard>
      </StatsGrid>
      {/* Recent Activity */}
      <RecentActivity>
        <h3><FiFileText style={{ display: 'inline', marginRight: '0.5rem' }} />Recent Activity</h3>
        <ActivityItem iconColor="#3b82f6">
          <div className="activity-icon">
            <FiCalendar />
          </div>
          <div className="activity-content">
            <div className="activity-title">Appointment booked. Doctor to be assigned at the clinic</div>
            <div className="activity-time">2 days ago</div>
          </div>
        </ActivityItem>
        <ActivityItem iconColor="#059669">
          <div className="activity-icon">
            <FiFileText />
          </div>
          <div className="activity-content">
            <div className="activity-title">Lab results uploaded</div>
            <div className="activity-time">5 days ago</div>
          </div>
        </ActivityItem>
        <ActivityItem iconColor="#a855f7">
          <div className="activity-icon">
            <FiUser />
          </div>
          <div className="activity-content">
            <div className="activity-title">Profile updated</div>
            <div className="activity-time">1 week ago</div>
          </div>
        </ActivityItem>
      </RecentActivity>
      {/* Health Tips */}
      <HealthTips>
        <h3>💡 Health Tips for You</h3>
        <div className="tip">
          <strong>Stay Hydrated:</strong> Drink at least 8 glasses of water daily to maintain optimal health.
        </div>
        <div className="tip">
          <strong>Regular Exercise:</strong> Aim for at least 30 minutes of moderate exercise 5 times per week.
        </div>
        <div className="tip">
          <strong>Preventive Care:</strong> Don't forget your annual check-up and recommended screenings.
        </div>
      </HealthTips>
      <DashboardGrid>
        <ProfileCard>
          <CardTitle>
            Your Profile
            <div>
              {!editMode ? (
                <EditButton onClick={handleEdit}>
                  <FiEdit3 />
                  Edit Profile
                </EditButton>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <EditButton variant="save" onClick={handleSave}>
                    <FiSave />
                    Save
                  </EditButton>
                  <EditButton variant="cancel" onClick={handleCancel}>
                    <FiX />
                    Cancel
                  </EditButton>
                </div>
              )}
            </div>
          </CardTitle>
          <ProfileSection>
            <SectionTitle>
              <FiUser />
              Personal Information
            </SectionTitle>
            <ProfileRow>
              <ProfileField>
                <Label>First Name</Label>
                {editMode ? (
                  <Input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <Value>{profileData.firstName || 'Not provided'}</Value>
                )}
              </ProfileField>
              <ProfileField>
                <Label>Last Name</Label>
                {editMode ? (
                  <Input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <Value>{profileData.lastName || 'Not provided'}</Value>
                )}
              </ProfileField>
            </ProfileRow>
            <ProfileRow>
              <ProfileField>
                <Label>Date of Birth</Label>
                {editMode ? (
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleChange}
                  />
                ) : (
                  <Value>{profileData.dateOfBirth || 'Not provided'}</Value>
                )}
              </ProfileField>
              <ProfileField>
                <Label>Phone Number</Label>
                {editMode ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <Value>{profileData.phone || 'Not provided'}</Value>
                )}
              </ProfileField>
            </ProfileRow>
          </ProfileSection>
          <ProfileSection>
            <SectionTitle>
              <FiMail />
              Contact Information
            </SectionTitle>
            <ProfileField>
              <Label>Email Address</Label>
              <Value>{profileData.email || 'Not provided'}</Value>
            </ProfileField>
            <ProfileField style={{ marginTop: '1rem' }}>
              <Label>Address</Label>
              {editMode ? (
                <Input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                />
              ) : (
                <Value>{profileData.address || 'Not provided'}</Value>
              )}
            </ProfileField>
            <ProfileField style={{ marginTop: '1rem' }}>
              <Label>Emergency Contact</Label>
              {editMode ? (
                <Input
                  type="text"
                  name="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={handleChange}
                />
              ) : (
                <Value>{profileData.emergencyContact || 'Not provided'}</Value>
              )}
            </ProfileField>
          </ProfileSection>
        </ProfileCard>
        <ProfileCard>
          <CardTitle>
            Medical Information
          </CardTitle>
          <ProfileSection>
            <SectionTitle>
              <FiFileText />
              Medical History
            </SectionTitle>
            <ProfileField>
              <Label>Medical History</Label>
              {editMode ? (
                <TextArea
                  name="medicalHistory"
                  value={profileData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Previous surgeries, chronic conditions, major illnesses..."
                />
              ) : (
                <Value>{profileData.medicalHistory || 'No medical history provided'}</Value>
              )}
            </ProfileField>
          </ProfileSection>
          <ProfileSection>
            <SectionTitle>
              <FiAlertCircle />
              Allergies & Medications
            </SectionTitle>
            <ProfileField>
              <Label>Allergies</Label>
              {editMode ? (
                <Input
                  type="text"
                  name="allergies"
                  value={profileData.allergies}
                  onChange={handleChange}
                  placeholder="Drug allergies, food allergies..."
                />
              ) : (
                <Value>{profileData.allergies || 'No known allergies'}</Value>
              )}
            </ProfileField>
            <ProfileField style={{ marginTop: '1rem' }}>
              <Label>Current Medications</Label>
              {editMode ? (
                <Input
                  type="text"
                  name="currentMedications"
                  value={profileData.currentMedications}
                  onChange={handleChange}
                  placeholder="List current medications..."
                />
              ) : (
                <Value>{profileData.currentMedications || 'No current medications'}</Value>
              )}
            </ProfileField>
          </ProfileSection>
        </ProfileCard>
      </DashboardGrid>
      <HealthChatBot />
    </DashboardContainer>
  );
};

export default PatientDashboard;