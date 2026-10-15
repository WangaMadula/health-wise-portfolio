import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  max-width: 720px;
  width: 100%;
`;

const SeedDoctors = () => {
  const [status, setStatus] = useState('idle');
  const doctors = [
    { name: 'Dr. Thabo Mokoena', specialization: 'General Practitioner', email: 'thabo.mokoena@healthwise.clinic', phone: '0821234567', profileImage: '' },
    { name: 'Dr. Zanele Khumalo', specialization: 'Pediatrician', email: 'zanele.khumalo@healthwise.clinic', phone: '0832345678', profileImage: '' },
    { name: 'Dr. Sipho Dlamini', specialization: 'Cardiologist', email: 'sipho.dlamini@healthwise.clinic', phone: '0843456789', profileImage: '' },
    { name: 'Dr. Lerato Molefe', specialization: 'Dentist', email: 'lerato.molefe@healthwise.clinic', phone: '0854567890', profileImage: '' },
    { name: 'Dr. Johan van der Merwe', specialization: 'Ophthalmologist', email: 'johan.vdmerwe@healthwise.clinic', phone: '0865678901', profileImage: '' }
  ];

  const seed = async () => {
    setStatus('checking');
    try {
      const doctorsCol = collection(db, 'doctors');
      const snap = await getDocs(doctorsCol);
      if (!snap.empty) {
        setStatus('already');
        return;
      }
      setStatus('seeding');
      for (const d of doctors) {
        await addDoc(doctorsCol, d);
      }
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <Container>
      <Card>
        <h2>Seed Doctors</h2>
        <p>This page will add sample doctors to your Firestore <code>doctors</code> collection. Use this once during setup.</p>
        <div style={{ marginTop: 16 }}>
          {status === 'idle' && (
            <button onClick={seed}>Seed doctors</button>
          )}
          {status === 'checking' && <div>Checking for existing doctors...</div>}
          {status === 'seeding' && <div>Seeding doctors...</div>}
          {status === 'done' && <div>Seeding complete. Doctors added.</div>}
          {status === 'already' && <div>Doctors collection already populated. Nothing to do.</div>}
          {status === 'error' && <div>There was an error seeding doctors. Check console.</div>}
        </div>
      </Card>
    </Container>
  );
};

export default SeedDoctors;
