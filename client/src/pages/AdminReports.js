

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiFileText, FiCalendar, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
// Only show one session expired toast at a time
let sessionToastId = null;

// Helper for table rendering
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
`;
const Th = styled.th`
  background: #ede9fe;
  color: #7c3aed;
  font-weight: 700;
  padding: 0.7rem 0.5rem;
  text-align: left;
  font-size: 1rem;
`;
const Td = styled.td`
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.98rem;
`;
const Tr = styled.tr``;

// Styled form for admin add
const AddForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  input {
    padding: 0.4rem 0.7rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
  }
  button {
    background: #7c3aed;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.45rem 1.1rem;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  button:hover {
    background: #5b21b6;
  }
`;

const AdminReports = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ patient: '', doctor: '', appointmentDate: '', status: '' });
  const [patients, setPatients] = useState([]);
  const [files, setFiles] = useState([]);
    const [editingClientId, setEditingClientId] = useState(null);
    const [clientEditData, setClientEditData] = useState({ name: '', email: '', phone: '' });
    const [editingFileId, setEditingFileId] = useState(null);
    const [fileEditData, setFileEditData] = useState({ fileName: '', fileType: '' });
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [doctorEditData, setDoctorEditData] = useState({ name: '', email: '', phone: '', service: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // For polling refresh
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // No backend axios; keep placeholder to avoid duplicate toasts
  }, []);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const apptsSnap = await getDocs(collection(db, 'appointments'));
      const patsSnap = await getDocs(collection(db, 'patients'));
      const filesSnap = await getDocs(collection(db, 'files'));

      const appts = apptsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const pats = patsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const fls = filesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      setAppointments(appts);
      setPatients(pats);
      setFiles(fls);
      setError('');
    } catch (err) {
      console.error('Failed to fetch report data', err);
      setError('Failed to load report data.');
    } finally {
      setLoading(false);
    }
  };


  // Only fetch once on mount or when refreshKey changes
  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  // Listen for booking event via localStorage (cross-tab)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'new_booking_event') {
        setRefreshKey(k => k + 1);
        toast.info('A new appointment has been booked!', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <PageWrapper>
      <HeaderRow>
        <MainTitle><FiBarChart2 /> Admin Reports</MainTitle>
      </HeaderRow>
      {loading ? (
        <LoadingMsg>Loading reports...</LoadingMsg>
      ) : (
        <>
          {error && <ErrorMsg>{typeof error === 'string' ? error : 'An error occurred.'}</ErrorMsg>}
          <SlotPanel>
            <SlotHeader><FiUsers /> Clients</SlotHeader>
            <SlotContent>
              <SlotStat>{patients.length}</SlotStat>
              <SlotDesc>Unique clients in the system</SlotDesc>
              {/* Admin add client form */}
              <AddForm onSubmit={async e => {
                e.preventDefault();
                const form = e.target;
                const name = form.name.value.trim();
                const email = form.email.value.trim();
                const phone = form.phone.value.trim();
                if (!name || !email) return toast.error('Name and email required');
                try {
                  await addDoc(collection(db, 'patients'), {
                    name,
                    email,
                    phone,
                    report: {
                      name,
                      email
                    }
                  });
                  toast.success('Client added!');
                  setRefreshKey(k => k + 1);
                  form.reset();
                } catch (err) {
                  toast.error('Failed to add client');
                }
              }}>
                <input name="name" placeholder="Name" required />
                <input name="email" placeholder="Email" required type="email" />
                <input name="phone" placeholder="Phone" />
                <button type="submit">Add Client</button>
              </AddForm>
              <Table>
                <thead>
                  <Tr>
                    <Th>Patient Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Action</Th>
                  </Tr>
                </thead>
                <tbody>
                  {patients.slice(0, 5).map((p) => (
                    <Tr key={p._id || p.id}>
                      <Td>
                        {editingClientId === p.id ? (
                          <input value={clientEditData.name} onChange={e => setClientEditData({ ...clientEditData, name: e.target.value })} />
                        ) : p.name}
                      </Td>
                      <Td>
                        {editingClientId === p.id ? (
                          <input value={clientEditData.email} onChange={e => setClientEditData({ ...clientEditData, email: e.target.value })} />
                        ) : p.email}
                      </Td>
                      <Td>
                        {editingClientId === p.id ? (
                          <input value={clientEditData.phone} onChange={e => setClientEditData({ ...clientEditData, phone: e.target.value })} />
                        ) : p.phone}
                      </Td>
                      <Td style={{ display: 'flex', gap: '8px' }}>
                        {editingClientId === p.id ? (
                          <>
                            <button style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              // TODO: Update Firestore with new values
                              setEditingClientId(null);
                              toast.success('Client updated (demo only)');
                            }}>Save</button>
                            <button style={{ background: '#e0e7ff', color: '#1a365d', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingClientId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button style={{ background: '#63b3ed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                              setEditingClientId(p.id);
                              setClientEditData({ name: p.name || '', email: p.email || '', phone: p.phone || '' });
                            }}>Edit</button>
                            <button style={{ color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              if (window.confirm('Delete this client?')) {
                                await deleteDoc(doc(db, 'patients', p.id));
                                toast.success('Client deleted');
                                setRefreshKey(k => k + 1);
                              }
                            }}>Delete</button>
                          </>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </SlotContent>
          </SlotPanel>
          <SlotPanel>
            <SlotHeader><FiFileText /> Files</SlotHeader>
            <SlotContent>
              <SlotStat>{files.length}</SlotStat>
              <SlotDesc>Total files uploaded by clients</SlotDesc>
              {/* Admin add file form with upload slot */}
              <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <AddForm style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-start' }} onSubmit={async e => {
                  e.preventDefault();
                  const form = e.target;
                  const fileName = form.fileName.value.trim();
                  const fileType = form.fileType.value.trim();
                  const fileInput = form.fileInput.files[0];
                  if (!fileName || !fileType) return toast.error('File name and type required');
                  if (!fileInput) return toast.error('Please select a file to upload');
                  // For demo: just store file name/type, not actual file content
                  // For real upload, integrate with Firebase Storage or similar
                  try {
                    await addDoc(collection(db, 'files'), {
                      fileName,
                      fileType,
                      fileSize: fileInput.size,
                      fileLastModified: fileInput.lastModified,
                      createdAt: new Date().toISOString()
                    });
                    toast.success('File added! (Demo: file not actually uploaded)');
                    setRefreshKey(k => k + 1);
                    form.reset();
                  } catch (err) {
                    toast.error('Failed to add file');
                  }
                }}>
                  <input name="fileName" placeholder="File Name" required />
                  <input name="fileType" placeholder="Type" required />
                  <input name="fileInput" type="file" required style={{ maxWidth: 220 }} />
                  <button type="submit">Add File</button>
                </AddForm>
              </div>
              <Table>
                <thead>
                  <Tr>
                    <Th>File Name</Th>
                    <Th>Type</Th>
                    <Th>Uploaded</Th>
                    <Th>Action</Th>
                  </Tr>
                </thead>
                <tbody>
                  {files.slice(0, 5).map((f) => (
                    <Tr key={f._id || f.id}>
                      <Td>
                        {editingFileId === f.id ? (
                          <input value={fileEditData.fileName} onChange={e => setFileEditData({ ...fileEditData, fileName: e.target.value })} />
                        ) : (f.fileName || f.name)}
                      </Td>
                      <Td>
                        {editingFileId === f.id ? (
                          <input value={fileEditData.fileType} onChange={e => setFileEditData({ ...fileEditData, fileType: e.target.value })} />
                        ) : f.fileType}
                      </Td>
                      <Td>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ''}</Td>
                      <Td style={{ display: 'flex', gap: '8px' }}>
                        {editingFileId === f.id ? (
                          <>
                            <button style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              // TODO: Update Firestore with new values
                              setEditingFileId(null);
                              toast.success('File updated (demo only)');
                            }}>Save</button>
                            <button style={{ background: '#e0e7ff', color: '#1a365d', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingFileId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button style={{ background: '#63b3ed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                              setEditingFileId(f.id);
                              setFileEditData({ fileName: f.fileName || f.name || '', fileType: f.fileType || '' });
                            }}>Edit</button>
                            <button style={{ color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              if (window.confirm('Delete this file?')) {
                                await deleteDoc(doc(db, 'files', f.id));
                                toast.success('File deleted');
                                setRefreshKey(k => k + 1);
                              }
                            }}>Delete</button>
                          </>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </SlotContent>
          </SlotPanel>
          <SlotPanel style={{ minHeight: '420px', width: '100%', maxWidth: 'none', boxSizing: 'border-box', padding: '2.2rem 2rem 1.5rem 2rem', marginLeft: 0, marginRight: 0 }}>
            <SlotHeader><FiCalendar /> Appointments</SlotHeader>
            <SlotContent>
              <SlotStat>{appointments.length}</SlotStat>
              <SlotDesc>Total appointments booked</SlotDesc>
              {/* Admin add appointment form */}
              <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                  <AddForm style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-start' }} onSubmit={async e => {
                    e.preventDefault();
                    const form = e.target;
                    const patient = form.patient.value.trim();
                    const doctor = form.doctor.value.trim();
                    const appointmentDate = form.appointmentDate.value;
                    const status = form.status.value.trim() || 'scheduled';
                    if (!patient || !doctor || !appointmentDate) return toast.error('All fields required');
                    try {
                      await addDoc(collection(db, 'appointments'), { patient: { name: patient }, doctor: { name: doctor }, appointmentDate, status });
                      toast.success('Appointment added!');
                      setRefreshKey(k => k + 1);
                      form.reset();
                    } catch (err) {
                      toast.error('Failed to add appointment');
                    }
                  }}>
                    <input name="patient" placeholder="Patient Name" required defaultValue={patients.length > 0 ? patients[0].name : ''} />
                    <input name="doctor" placeholder="Doctor Name" required />
                    <input name="appointmentDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    <input name="status" placeholder="Status (default scheduled)" />
                    <button type="submit">Add Appointment</button>
                  </AddForm>
              </div>
              <Table>
                <thead>
                  <Tr>
                    <Th>Patient</Th>
                    <Th>Doctor</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </Tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((a) => (
                    <Tr key={a._id || a.id}>
                      <Td>
                        {editingId === a.id ? (
                          <input value={editData.patient} onChange={e => setEditData({ ...editData, patient: e.target.value })} />
                        ) : (a.patient?.name || '')}
                      </Td>
                      <Td>
                        {editingId === a.id ? (
                          <input value={editData.doctor} onChange={e => setEditData({ ...editData, doctor: e.target.value })} />
                        ) : (a.doctor?.name || '')}
                      </Td>
                      <Td>
                        {editingId === a.id ? (
                          <input type="date" value={editData.appointmentDate} onChange={e => setEditData({ ...editData, appointmentDate: e.target.value })} />
                        ) : (a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : '')}
                      </Td>
                      <Td>
                        {editingId === a.id ? (
                          <input value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} />
                        ) : a.status}
                      </Td>
                      <Td style={{ display: 'flex', gap: '8px' }}>
                        {editingId === a.id ? (
                          <>
                            <button style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              // TODO: Update Firestore with new values
                              setEditingId(null);
                              toast.success('Appointment updated (demo only)');
                            }}>Save</button>
                            <button style={{ background: '#e0e7ff', color: '#1a365d', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button style={{ background: '#63b3ed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                              setEditingId(a.id);
                              setEditData({
                                patient: a.patient?.name || '',
                                doctor: a.doctor?.name || '',
                                appointmentDate: a.appointmentDate ? new Date(a.appointmentDate).toISOString().split('T')[0] : '',
                                status: a.status || ''
                              });
                            }}>Edit</button>
                            <button style={{ color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              if (window.confirm('Delete this appointment?')) {
                                await deleteDoc(doc(db, 'appointments', a.id));
                                toast.success('Appointment deleted');
                                setRefreshKey(k => k + 1);
                              }
                            }}>Delete</button>
                          </>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </SlotContent>
          </SlotPanel>

          {/* Doctor Section */}
          <SlotPanel>
            <SlotHeader><FiUsers /> Doctors</SlotHeader>
            <SlotContent>
              <SlotStat>{patients.filter(p => p.role === 'doctor').length}</SlotStat>
              <SlotDesc>Total doctors in the system</SlotDesc>
              {/* Admin add doctor form */}
              <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <AddForm style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-start' }} onSubmit={async e => {
                  e.preventDefault();
                  const form = e.target;
                  const name = form.name.value.trim();
                  const email = form.email.value.trim();
                  const phone = form.phone.value.trim();
                  const service = form.service.value.trim();
                  if (!name || !email) return toast.error('Name and email required');
                  try {
                    await addDoc(collection(db, 'patients'), { name, email, phone, service, role: 'doctor' });
                    toast.success('Doctor added!');
                    setRefreshKey(k => k + 1);
                    form.reset();
                  } catch (err) {
                    toast.error('Failed to add doctor');
                  }
                }}>
                  <input name="name" placeholder="Doctor Name" required />
                  <input name="email" placeholder="Email" required type="email" />
                  <input name="phone" placeholder="Phone" />
                  <input name="service" placeholder="Service" />
                  <button type="submit">Add Doctor</button>
                </AddForm>
              </div>
              <Table>
                <thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Service</Th>
                    <Th>Action</Th>
                  </Tr>
                </thead>
                <tbody>
                  {patients.filter(p => p.role === 'doctor').slice(0, 10).map((d) => (
                    <Tr key={d._id || d.id}>
                      <Td>
                        {editingDoctorId === d.id ? (
                          <input value={doctorEditData.name} onChange={e => setDoctorEditData({ ...doctorEditData, name: e.target.value })} />
                        ) : d.name}
                      </Td>
                      <Td>
                        {editingDoctorId === d.id ? (
                          <input value={doctorEditData.email} onChange={e => setDoctorEditData({ ...doctorEditData, email: e.target.value })} />
                        ) : d.email}
                      </Td>
                      <Td>
                        {editingDoctorId === d.id ? (
                          <input value={doctorEditData.phone} onChange={e => setDoctorEditData({ ...doctorEditData, phone: e.target.value })} />
                        ) : d.phone}
                      </Td>
                      <Td>
                        {editingDoctorId === d.id ? (
                          <input value={doctorEditData.service} onChange={e => setDoctorEditData({ ...doctorEditData, service: e.target.value })} />
                        ) : (d.service || '')}
                      </Td>
                      <Td style={{ display: 'flex', gap: '8px' }}>
                        {editingDoctorId === d.id ? (
                          <>
                            <button style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              // TODO: Update Firestore with new values
                              setEditingDoctorId(null);
                              toast.success('Doctor updated (demo only)');
                            }}>Save</button>
                            <button style={{ background: '#e0e7ff', color: '#1a365d', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setEditingDoctorId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button style={{ background: '#63b3ed', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                              setEditingDoctorId(d.id);
                              setDoctorEditData({ name: d.name || '', email: d.email || '', phone: d.phone || '', service: d.service || '' });
                            }}>Edit</button>
                            <button style={{ color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={async () => {
                              if (window.confirm('Delete this doctor?')) {
                                await deleteDoc(doc(db, 'patients', d.id));
                                toast.success('Doctor deleted');
                                setRefreshKey(k => k + 1);
                              }
                            }}>Delete</button>
                          </>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </SlotContent>
          </SlotPanel>
        </>
      )}
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
`;
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
`;
const MainTitle = styled.h1`
  font-size: 2.3rem;
  color: #7c3aed;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 900;
`;
const SlotPanel = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(30,60,114,0.09);
  margin-bottom: 2.2rem;
  padding: 2.2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
`;
const SlotHeader = styled.h2`
  color: #1a365d;
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;
const SlotContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const SlotStat = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #7c3aed;
  margin-bottom: 0.5rem;
`;
const SlotDesc = styled.div`
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
`;
const ErrorMsg = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1.5px solid #f87171;
  border-radius: 8px;
  padding: 0.9rem 1.1rem;
  margin-bottom: 1.2rem;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.1px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;
const LoadingMsg = styled.div`
  color: #7c3aed;
  font-size: 1.1rem;
  text-align: center;
  margin: 2rem 0;
`;

export default AdminReports;
