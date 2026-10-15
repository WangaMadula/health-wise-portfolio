import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import emailjs from 'emailjs-com';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

import { FaUserMd, FaStethoscope, FaHeartbeat, FaSyringe, FaVials, FaAmbulance, FaTooth, FaEye } from 'react-icons/fa';

// Professional medical icons for each service
const serviceIcons = {
  general: <FaUserMd size={36} color="#7c3aed" />,
  specialist: <FaStethoscope size={36} color="#7c3aed" />,
  checkup: <FaHeartbeat size={36} color="#7c3aed" />,
  vaccination: <FaSyringe size={36} color="#7c3aed" />,
  lab: <FaVials size={36} color="#7c3aed" />,
  emergency: <FaAmbulance size={36} color="#7c3aed" />,
  dental: <FaTooth size={36} color="#7c3aed" />,
  vision: <FaEye size={36} color="#7c3aed" />
};

const services = [
	{ id: 'general', name: 'General Consultation', description: 'Regular check-up and consultation with a general practitioner', price: 850 },
	{ id: 'specialist', name: 'Specialist Consultation', description: 'Consultation with a medical specialist', price: 990 },
	{ id: 'checkup', name: 'Medical Check-up', description: 'Comprehensive health screening and medical examination', price: 900 },
	{ id: 'vaccination', name: 'Vaccination', description: 'Immunization and vaccination services', price: 700 },
	{ id: 'lab', name: 'Laboratory Tests', description: 'Blood tests, urine analysis, and other laboratory services', price: 800 },
	{ id: 'emergency', name: 'Emergency Care', description: 'Urgent medical care and emergency treatment', price: 1200 },
	{ id: 'dental', name: 'Dental Check-up', description: 'Routine dental examination and cleaning', price: 950 },
	{ id: 'vision', name: 'Vision Screening', description: 'Eye examination and vision testing', price: 650 },
];


const Appointment = () => {
	const { user } = useAuth();
	// Initialize EmailJS
	emailjs.init('L8gwd9wbePDM1q9IY');
	const [selectedService, setSelectedService] = useState(null);
	const [success, setSuccess] = useState("");
	const [vaccinationType, setVaccinationType] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [appointments, setAppointments] = useState([]); // Store booked appointments

	// Use authenticated user's email and name
	const userEmail = user?.email || "";
	const userName = user?.displayName || user?.email || "";
	const handleBook = async () => {
		if (!selectedService || !date || !time || (selectedService === 'vaccination' && !vaccinationType)) {
			setSuccess("Please complete all fields.");
			setTimeout(() => setSuccess("") , 3000);
			return;
		}
		// Prepare appointment data
		const appointmentData = {
			patientName: userName,
			patientEmail: userEmail,
			service: selectedService,
			date,
			time,
			status: 'scheduled',
			createdAt: new Date().toISOString()
		};
		if (selectedService === 'vaccination' && vaccinationType) {
			appointmentData.vaccinationType = vaccinationType;
		}
		// Send booking email (replace with your actual API call)
		try {
			// Send email using EmailJS
			await emailjs.send(
				'service_2xfpp3o',
				'template_8e46zxn',
				{
					to_email: userEmail, // Use actual user email
					from_name: 'Healthwise Clinic',
					service: selectedService,
					date,
					time,
					vaccinationType: selectedService === 'vaccination' ? vaccinationType : undefined
				},
				'L8gwd9wbePDM1q9IY'
			);
			// Save appointment to Firestore
			await addDoc(collection(db, 'appointments'), appointmentData);
		} catch (err) {
			setSuccess(`Booking successful, but email failed to send: ${err.text || err.message}`);
			setTimeout(() => setSuccess("") , 3000);
			// Add appointment anyway
			setAppointments(prev => [
				...prev,
				{
					patient: userName,
					service: selectedService,
					date,
					time,
					vaccinationType: selectedService === 'vaccination' ? vaccinationType : undefined
				}
			]);
			// Save appointment to Firestore even if email fails
			await addDoc(collection(db, 'appointments'), appointmentData);
			// Clear selections
			setSelectedService(null);
			setVaccinationType("");
			setDate("");
			setTime("");
			return;
		}
	setSuccess("Booking successful!");
	setTimeout(() => setSuccess("") , 3000);
		// Add appointment to state
		setAppointments(prev => [
			...prev,
			{
				patient: userName,
				service: selectedService,
				date,
				time,
				vaccinationType: selectedService === 'vaccination' ? vaccinationType : undefined
			}
		]);
		// Clear selections
		setSelectedService(null);
		setVaccinationType("");
		setDate("");
		setTime("");
	};

	return (
		<AppointmentContainer>
			<HeroSection>
				<HeroContent>
					<h1>Book an Appointment</h1>
					<p>We're glad to see you! Schedule your visit with our caring medical team today.</p>
				</HeroContent>
			</HeroSection>
			<MainContent>
				<MainHeading>Book your Appointment now</MainHeading>
				{success && <SuccessMsg>{success}</SuccessMsg>}
				<ServiceList>
					{services.map(service => (
						<ServiceCard
							key={service.id}
							selected={selectedService === service.id}
							onClick={() => setSelectedService(service.id)}
						>
							<div className="icon" aria-label={service.name}>
								{serviceIcons[service.id]}
							</div>
							<div>
								<h4>{service.name}</h4>
								<p>{service.description}</p>
								<div className="price">R {service.price.toLocaleString('en-ZA')}</div>
							</div>
						</ServiceCard>
					))}
				</ServiceList>
				{selectedService === 'vaccination' && (
					<div style={{ width: '100%', marginBottom: '1.5rem', textAlign: 'center' }}>
						<label htmlFor="vaccinationType" style={{ fontWeight: 600, marginRight: 8 }}>Select Vaccination Type:</label>
						<select
							id="vaccinationType"
							value={vaccinationType}
							onChange={e => setVaccinationType(e.target.value)}
							style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #a855f7', minWidth: 180 }}
						>
							<option value="">-- Choose --</option>
							<option value="COVID-19">COVID-19</option>
							<option value="Flu">Flu</option>
							<option value="Hepatitis B">Hepatitis B</option>
							<option value="HPV">HPV</option>
							<option value="Yellow Fever">Yellow Fever</option>
						</select>
					</div>
				)}
				{selectedService && (
					<div style={{ width: '100%', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
						<div>
							<label htmlFor="date" style={{ fontWeight: 600, marginRight: 8 }}>Date:</label>
							<input
								type="date"
								id="date"
								value={date}
								onChange={e => setDate(e.target.value)}
								style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #a855f7', minWidth: 120 }}
							/>
						</div>
						<div>
							<label htmlFor="time" style={{ fontWeight: 600, marginRight: 8 }}>Time:</label>
							<input
								type="time"
								id="time"
								value={time}
								onChange={e => setTime(e.target.value)}
								style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #a855f7', minWidth: 100 }}
							/>
						</div>
					</div>
				)}
				<SubmitButton disabled={!selectedService || !date || !time || (selectedService === 'vaccination' && !vaccinationType)} onClick={handleBook}>Book Appointment</SubmitButton>
				{/* Show booked appointments */}
				{appointments.length > 0 && (
					<div style={{ marginTop: '2.5rem', width: '100%' }}>
						<SectionHeading>Booked Appointments</SectionHeading>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							{appointments.map((appt, idx) => (
								<li key={idx} style={{ background: '#f3f0ff', borderRadius: 10, marginBottom: 12, padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(124,58,237,0.08)' }}>
									<strong>Patient:</strong> {appt.patient} <br />
									<strong>Service:</strong> {services.find(s => s.id === appt.service)?.name || appt.service} <br />
									<strong>Date:</strong> {appt.date} <br />
									<strong>Time:</strong> {appt.time} <br />
									{appt.vaccinationType && (<><strong>Vaccination Type:</strong> {appt.vaccinationType} <br /></>)}
								</li>
							))}
						</ul>
					</div>
				)}
			</MainContent>
		</AppointmentContainer>
	);
}
// Styled-components definitions
const MainHeading = styled.h2`
	width: 100%;
	text-align: center;
	color: #7c3aed;
	font-size: 2rem;
	font-weight: 900;
	font-family: 'Montserrat', Arial, sans-serif;
	letter-spacing: 0.5px;
	margin-bottom: 2rem;
`;

const MainContent = styled.main`
	width: 100vw;
	max-width: 100vw;
	min-height: 400px;
	background: #fff;
	border-radius: 24px;
	box-shadow: 0 4px 24px rgba(30,60,114,0.08);
	margin: 0 auto 2.5rem auto;
	padding: 2.5rem 2rem 2rem 2rem;
	position: relative;
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const SectionHeading = styled.h2`
	width: 100vw;
	max-width: 100vw;
	margin: 0 auto 0.5rem auto;
	padding: 2.5rem 0 0.5rem 0;
	text-align: center;
	color: #7c3aed;
	font-size: 2rem;
	font-weight: 900;
	font-family: 'Montserrat', Arial, sans-serif;
	letter-spacing: 0.5px;
`;

const AppointmentContainer = styled.div`
	min-height: 100vh;
	background: linear-gradient(135deg, #f0f7ff 60%, #e0e7ff 100%);
	padding-bottom: 3rem;
`;

const HeroContent = styled.div`
	position: relative;
	z-index: 3;
	text-align: center;
	color: #7c3aed;
	padding: 2.5rem 1.5rem 2rem;
	width: 100%;
	max-width: 900px;
	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		letter-spacing: -1px;
		text-shadow: 0 4px 24px rgba(0,0,0,0.13);
	}
	p {
		font-size: 1.18rem;
		color: #4b5563;
		margin: 0.7rem auto 0;
		font-weight: 500;
		text-shadow: 0 1px 4px rgba(255,255,255,0.13);
		max-width: 600px;
	}
`;
const SuccessMsg = styled.div`
	background: #d1fae5;
	color: #047857;
	border: 1.5px solid #34d399;
	border-radius: 8px;
	padding: 0.9rem 1.1rem;
	margin-bottom: 1.2rem;
	text-align: center;
	font-size: 1.08rem;
	font-weight: 700;
	letter-spacing: 0.2px;
`;

const ServiceList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
	gap: 1.5rem 2rem;
	margin-bottom: 2.5rem;
	width: 100%;
`;

const ServiceCard = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 1.1rem;
	background: #fff;
	border-radius: 18px;
	padding: 1.7rem 1.3rem 1.3rem 1.3rem;
	cursor: pointer;
	border: 2.5px solid ${props => props.selected ? '#7c3aed' : '#e0e7ff'};
	box-shadow: 0 4px 24px rgba(124,58,237,0.08), 0 1.5px 8px rgba(0,0,0,0.04);
	transition: border 0.18s, box-shadow 0.18s, background 0.18s, transform 0.13s;
	position: relative;
	min-width: 0;
	&:hover {
		border-color: #a855f7;
		background: #f3f0ff;
		box-shadow: 0 8px 32px rgba(124,58,237,0.13);
		transform: translateY(-3px) scale(1.015);
	}
	.icon {
		font-size: 2.5rem;
		color: #7c3aed;
		background: #f3f0ff;
		border-radius: 50%;
		width: 54px;
		height: 54px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 18px;
		box-shadow: 0 2px 8px rgba(124,58,237,0.10);
		flex-shrink: 0;
	}
	h4 {
		color: #7c3aed;
		margin-bottom: 0.2rem;
		font-size: 1.22rem;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 900;
		letter-spacing: 0.2px;
	}
	p {
		font-size: 1.08rem;
		opacity: 0.93;
		margin: 0;
		color: #6b7280;
		font-weight: 500;
		word-break: break-word;
	}
	.price {
		font-weight: bold;
		color: #a855f7;
		margin-top: 0.5rem;
		font-size: 1.13rem;
		letter-spacing: 0.5px;
	}
`;

const HeroSection = styled.section`
	position: relative;
	z-index: 3;
	text-align: center;
	color: #7c3aed;
	padding: 2.5rem 1.5rem 2rem;
	width: 100%;
	max-width: 900px;
	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		letter-spacing: -1px;
		text-shadow: 0 4px 24px rgba(0,0,0,0.13);
	}
	p {
		font-size: 1.18rem;
		color: #4b5563;
		margin: 0.7rem auto 0;
		font-weight: 500;
		text-shadow: 0 1px 4px rgba(255,255,255,0.13);
		max-width: 600px;
	}
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%);
  color: #fff;
  border: none;
  padding: 1.08rem 0;
  border-radius: 10px;
  font-size: 1.13rem;
  font-weight: 800;
  font-family: 'Montserrat', Arial, sans-serif;
  margin-top: 1.7rem;
  box-shadow: 0 2px 12px rgba(124,58,237,0.13);
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
  width: 100%;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  &:hover {
    background: linear-gradient(90deg, #a855f7 0%, #7c3aed 100%);
    box-shadow: 0 4px 20px rgba(124,58,237,0.18);
    transform: translateY(-1px) scale(1.01);
  }
`;

export default Appointment;