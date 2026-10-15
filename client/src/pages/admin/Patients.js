import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const HeroSection = styled.div`
  min-height: 340px;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/Doctor-with-mum-and-daughter-1-2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  margin-top: -24px !important;
  margin-bottom: 0;
  box-shadow: 0 4px 24px rgba(30,60,114,0.08);
  padding-top: 0 !important;
  z-index: 2;
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

const PatientsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e3ecfa 100%);
  padding: 2.5rem 1.5rem 3rem;
`;

const PatientsHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  h1 {
    color: #1e3c72;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
    letter-spacing: -1px;
  }
`;

const SearchBoxWrapper = styled.div`
  position: relative;
  width: 320px;
  max-width: 100%;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1.1rem;
  border: 1.5px solid #b6c6e3;
  border-radius: 10px;
  background: #f8fafc;
  color: #1e3c72;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(30,60,114,0.04);
  transition: border-color 0.2s;
  &::placeholder {
    color: #8ca0c9;
    font-weight: 400;
  }
  &:focus {
    outline: none;
    border-color: #3182ce;
    background: #fff;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #8ca0c9;
  font-size: 1.2rem;
  pointer-events: none;
`;

const TableCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(30,60,114,0.10);
  padding: 0 0 1.5rem 0;
  overflow-x: auto;
  border: 1.5px solid #e3ecfa;
`;

const PatientsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
  th, td {
    padding: 1rem 1.1rem;
    text-align: left;
    border-bottom: 1px solid #e3ecfa;
    font-size: 1rem;
  }
  th {
    background: #f0f4f8;
    color: #1e3c72;
    font-weight: 700;
    letter-spacing: 0.01em;
    border-bottom: 2px solid #b6c6e3;
  }
  tr:nth-child(even) td {
    background: #f8fafc;
  }
  tr:hover td {
    background: #e3ecfa;
    transition: background 0.2s;
  }
`;

const StatusBadge = styled.span`
  padding: 0.32rem 0.95rem;
  border-radius: 20px;
  font-size: 0.92rem;
  font-weight: 600;
  background: ${props => props.active ? 'linear-gradient(90deg, #34d399 60%, #6ee7b7 100%)' : 'linear-gradient(90deg, #f87171 60%, #fca5a5 100%)'};
  color: #fff;
  box-shadow: 0 2px 8px rgba(52,211,153,0.08);
  letter-spacing: 0.01em;
`;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch real patients from Firestore 'patients' collection
    const fetchPatients = async () => {
      try {
        const snap = await getDocs(collection(db, 'patients'));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPatients(docs);
      } catch (e) {
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    (patient.firstName + ' ' + patient.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <HeroSection>
        <HeroContent>
          <h1>Patients Management</h1>
          <p>View, search, and manage all registered patients in your clinic. Quickly access patient details, appointment history, and more.</p>
        </HeroContent>
      </HeroSection>
      <PatientsContainer>
        <PatientsHeader>
          <h1 style={{display:'none'}}>Patients Management</h1>
          <SearchBoxWrapper>
            <SearchBox
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="7.5" stroke="#8ca0c9" strokeWidth="2"/><path d="M16 16l-3.5-3.5" stroke="#8ca0c9" strokeWidth="2" strokeLinecap="round"/></svg>
            </SearchIcon>
          </SearchBoxWrapper>
        </PatientsHeader>
        <TableCard>
          <PatientsTable>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.createdAt ? new Date(patient.createdAt.seconds ? patient.createdAt.seconds * 1000 : patient.createdAt).toLocaleDateString() : '\u2014'}</td>
                </tr>
              ))}
            </tbody>
          </PatientsTable>
        </TableCard>
      </PatientsContainer>
    </>
  );
};

export default Patients;