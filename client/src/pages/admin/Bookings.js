import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { sendAppointmentConfirmation } from '../../utils/email';
import DoctorHeaderImg from './Doctor-with-mum-and-daughter-1-2.jpg';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 0.7rem 1.2rem;
  box-shadow: 0 2px 12px 0 rgba(124,58,237,0.08);
`;

const BookingsContainer = styled.div`
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  background: #f3f6fd;
  min-height: 100vh;
  color: #232946;
  font-family: 'Montserrat', Arial, sans-serif;
  margin-top: 0;
`;

const BookingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h1 {
    color: #a855f7;
    font-size: 2rem;
    font-weight: 900;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 8px rgba(124,58,237,0.08);
  }
`;

const PageHeader = styled.div`
  width: 100vw;
  height: 480px;
  background: url(${DoctorHeaderImg}) center 20%/cover no-repeat;
  background-attachment: fixed;
  border: none;
  border-radius: 0;
  margin: 0;
  margin-top: -32px;
  box-shadow: none;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.0); /* No overlay, just for layout */
  z-index: 2;
  pointer-events: none;
`;

const HeaderTitle = styled.h1`
  color: #a855f7;
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 16px rgba(124,58,237,0.13);
  pointer-events: auto;
`;

const HeaderSubtitle = styled.p`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 1.2rem 0 0 0;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  max-width: 600px;
  text-align: center;
  pointer-events: auto;
`;


const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #f3e8ff;
  color: #7c3aed;
  font-size: 1rem;
  outline: none;
  font-weight: 600;
  box-shadow: 0 1px 4px 0 rgba(124,58,237,0.07);
  transition: box-shadow 0.2s;
  &:focus {
    box-shadow: 0 0 0 2px #a855f7;
  }
  option {
    background: #ede9fe;
    color: #7c3aed;
  }
`;

const BookingsTable = styled.table`
  width: 100%;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  th, td {
    font-size: 1.05rem;
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1.5px solid #ede9fe;
  }
  th {
    background: linear-gradient(120deg, #ede9fe 0%, #f3e8ff 100%);
    color: #a855f7;
    font-weight: 800;
    border-bottom: 2px solid #a855f7;
    text-align: center;
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(124,58,237,0.07);
  }
  td {
    background: rgba(255,255,255,0.7);
    color: #232946;
    font-weight: 600;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.35rem 1.1rem;
  margin: 0 0.2rem;
  border: none;
  border-radius: 6px;
  background: linear-gradient(90deg, #a855f7 60%, #9333ea 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(124,58,237,0.10);
  transition: background 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #9333ea 60%, #a855f7 100%);
    transform: translateY(-1px) scale(1.04);
  }
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2.2rem;
`;

const StatsCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 1.7rem 1.2rem;
  text-align: center;
  box-shadow: 0 4px 24px 0 rgba(124,58,237,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04);
  border: 2.5px solid #a855f7;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  
  &:first-child {
    background: #fff;
    box-shadow: 0 16px 48px 0 rgba(124,58,237,0.18), 0 2px 8px 0 rgba(0,0,0,0.10);
    /* No blur, fully visible */
  }

  &:hover {
    background: linear-gradient(90deg, #f3e8ff 60%, #e0e7ff 100%);
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 32px 0 rgba(124,58,237,0.13), 0 2px 8px 0 rgba(0,0,0,0.06);
  }
  h3 {
    color: #a855f7;
    font-size: 2.2rem;
    margin: 0;
    font-weight: 900;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 4px rgba(168,85,247,0.08);
  }
  p {
    margin: 0.5rem 0 0 0;
    opacity: 0.98;
    font-size: 1.08rem;
    font-weight: 600;
    color: #232946;
    letter-spacing: 0.1px;
  }
`;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const snap = await getDocs(collection(db, 'appointments'));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBookings(docs.map(b => ({
          id: b.id,
          patientName: b.patientName || b.userId || '—',
          doctorName: b.doctor || '—',
          service: b.service || b.clinic || '—',
          date: b.date || b.createdAt || '—',
          time: b.slot || '—',
          status: b.status || 'scheduled',
          amount: b.amount || 0
        })));

        // calculate stats
        const today = new Date().toISOString().split('T')[0];
        const total = docs.length;
        const todayCount = docs.filter(d => (d.date || '').toString().split('T')[0] === today).length;
        const pendingCount = docs.filter(d => (d.status || 'scheduled') === 'scheduled' || (d.status || '') === 'confirmed').length;
        const completedCount = docs.filter(d => (d.status || '') === 'completed').length;
        setStats({ total, today: todayCount, pending: pendingCount, completed: completedCount });
      } catch (e) {
        console.error('Failed to load bookings from Firestore', e);
      }
    };
    loadBookings();
  }, []);

  // Remove bookings without a patient name
  const filteredBookings = bookings
    .filter(booking => booking.patientName && booking.patientName !== '—' && booking.patientName.trim() !== '')
    .filter(booking => {
      if (filter === 'all') return true;
      return booking.status === filter;
    });

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Update status in Firestore
      const bookingRef = doc(db, 'appointments', bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));

      // Send email confirmation if status is confirmed
      if (newStatus === 'confirmed') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking && booking.patientEmail) {
          try {
            await sendAppointmentConfirmation({
              patientEmail: booking.patientEmail,
              patientName: booking.patientName || '',
              service: booking.service || '',
              date: booking.date || '',
              time: booking.time || ''
            });
            // Optionally show a toast or notification here
          } catch (e) {
            // Optionally handle email send error
          }
        }
      }
    } catch (err) {
      alert('Failed to update appointment status.');
    }
  };

  return (
    <>
      <PageHeader>
        <HeaderOverlay>
          <HeaderTitle>Admin Bookings</HeaderTitle>
          <HeaderSubtitle>
            Manage all patient appointments, confirmations, and schedules in one convenient dashboard.
          </HeaderSubtitle>
        </HeaderOverlay>
      </PageHeader>
      <BookingsContainer>
        <BookingsHeader>
          <h1>Bookings Management</h1>
          <FilterContainer>
            <span>Filter by status:</span>
            <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Bookings</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </FilterSelect>
          </FilterContainer>
        </BookingsHeader>
        <StatsCards>
          <StatsCard>
            <h3>{stats.total}</h3>
            <p>Total Bookings</p>
          </StatsCard>
          <StatsCard>
            <h3>{stats.today}</h3>
            <p>Today's Appointments</p>
          </StatsCard>
          <StatsCard>
            <h3>{stats.pending}</h3>
            <p>Pending Appointments</p>
          </StatsCard>
          <StatsCard>
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </StatsCard>
        </StatsCards>
        <BookingsTable>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.patientName}</td>
                <td>{booking.service}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  {booking.status === 'confirmed' || booking.status === 'completed' ? (
                    <span style={{ color: '#10b981', fontWeight: 700 }}>Paid</span>
                  ) : (
                    <span style={{ color: '#f59e42', fontWeight: 700 }}>Pending</span>
                  )}
                </td>
                <td>
                  <StatusBadge status={booking.status}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </StatusBadge>
                </td>
                <td>
                  {booking.status === 'scheduled' && (
                    <>
                      <ActionButton onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                        Confirm
                      </ActionButton>
                      <ActionButton onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                        Cancel
                      </ActionButton>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <>
                      <ActionButton onClick={() => handleStatusChange(booking.id, 'completed')}>
                        Complete
                      </ActionButton>
                      <ActionButton onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                        Cancel
                      </ActionButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </BookingsTable>
      </BookingsContainer>
    </>
  );
};

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4em 1em;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 700;
  color: #fff;
  background: ${({ status }) => {
    switch (status) {
      case 'scheduled': return '#f59e42';
      case 'cancelled': return '#ef4444';
      case 'confirmed': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  }};
`;

export default Bookings;