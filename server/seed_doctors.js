// Script to seed doctors into the database
// Usage: node seed_doctors.js

const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthwise-clinic';

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@healthwise.clinic',
    password: 'doctor123',
    role: 'doctor',
    phone: '+27 82 123 4567',
    specialization: 'General Practitioner',
    licenseNumber: 'GP123456',
    experience: 10,
    education: [
      { degree: 'MBChB', institution: 'University of Cape Town', year: 2012 }
    ],
    workingHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: true },
      sunday: { start: '', end: '', available: false }
    },
    consultationFee: 850,
    bio: 'Experienced GP with a passion for family medicine.',
    profileImage: null
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@healthwise.clinic',
    password: 'doctor123',
    role: 'doctor',
    phone: '+27 83 234 5678',
    specialization: 'Cardiologist',
    licenseNumber: 'CARD456789',
    experience: 8,
    education: [
      { degree: 'MBChB', institution: 'University of Pretoria', year: 2014 },
      { degree: 'MMed', institution: 'University of Pretoria', year: 2018 }
    ],
    workingHours: {
      monday: { start: '10:00', end: '16:00', available: true },
      tuesday: { start: '10:00', end: '16:00', available: true },
      wednesday: { start: '10:00', end: '16:00', available: true },
      thursday: { start: '10:00', end: '16:00', available: true },
      friday: { start: '10:00', end: '16:00', available: true },
      saturday: { start: '', end: '', available: false },
      sunday: { start: '', end: '', available: false }
    },
    consultationFee: 1200,
    bio: 'Specialist in heart health and cardiovascular disease.',
    profileImage: null
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const doc of doctors) {
    let user = await User.findOne({ email: doc.email });
    if (!user) {
      user = new User({
        name: doc.name,
        email: doc.email,
        password: doc.password,
        role: 'doctor',
        phone: doc.phone
      });
      await user.save();
      console.log(`Created user: ${doc.name}`);
    } else {
      console.log(`User already exists: ${doc.name}`);
    }
    let doctorProfile = await Doctor.findOne({ user: user._id });
    if (!doctorProfile) {
      doctorProfile = new Doctor({
        user: user._id,
        specialization: doc.specialization,
        licenseNumber: doc.licenseNumber,
        experience: doc.experience,
        education: doc.education,
        workingHours: doc.workingHours,
        consultationFee: doc.consultationFee,
        bio: doc.bio,
        profileImage: doc.profileImage
      });
      await doctorProfile.save();
      console.log(`Created doctor profile for: ${doc.name}`);
    } else {
      console.log(`Doctor profile already exists for: ${doc.name}`);
    }
  }
  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch(e => { console.error(e); process.exit(1); });
