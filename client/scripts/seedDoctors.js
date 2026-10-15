// Doctor seeding script for Firebase Firestore
// Run this script once to add doctors to your Firestore database
import { db } from '../src/firebase';
import { collection, addDoc } from 'firebase/firestore';

const doctors = [
  {
    name: 'Dr. Thabo Mokoena',
    specialization: 'General Practitioner',
    email: 'thabo.mokoena@healthwise.clinic',
    phone: '0821234567',
    profileImage: '',
  },
  {
    name: 'Dr. Zanele Khumalo',
    specialization: 'Pediatrician',
    email: 'zanele.khumalo@healthwise.clinic',
    phone: '0832345678',
    profileImage: '',
  },
  {
    name: 'Dr. Sipho Dlamini',
    specialization: 'Cardiologist',
    email: 'sipho.dlamini@healthwise.clinic',
    phone: '0843456789',
    profileImage: '',
  },
  {
    name: 'Dr. Lerato Molefe',
    specialization: 'Dentist',
    email: 'lerato.molefe@healthwise.clinic',
    phone: '0854567890',
    profileImage: '',
  },
  {
    name: 'Dr. Johan van der Merwe',
    specialization: 'Ophthalmologist',
    email: 'johan.vdmerwe@healthwise.clinic',
    phone: '0865678901',
    profileImage: '',
  },
];

async function seedDoctors() {
  for (const doc of doctors) {
    await addDoc(collection(db, 'doctors'), doc);
    console.log(`Added: ${doc.name}`);
  }
  console.log('Doctor seeding complete.');
}

seedDoctors();
