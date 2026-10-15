// Backend model file: remove all React and JSX imports

// If you need service data in backend, use only plain objects/strings:
const services = [
  { id: 'general', name: 'General Consultation', icon: 'fa-user-md' },
  { id: 'specialist', name: 'Specialist Consultation', icon: 'fa-heartbeat' },
  { id: 'checkup', name: 'Medical Check-up', icon: 'fa-calendar-alt' },
  { id: 'vaccination', name: 'Vaccination', icon: 'fa-stethoscope' },
  { id: 'lab', name: 'Laboratory Tests', icon: 'fa-flask' },
  { id: 'emergency', name: 'Emergency Care', icon: 'fa-ambulance' },
  { id: 'dental', name: 'Dental Check-up', icon: 'fa-tooth' },
  { id: 'vision', name: 'Vision Screening', icon: 'fa-eye' },
];

// Example Appointment model for backend (using Mongoose as an example)
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  service: {
    type: String,
    enum: services.map(s => s.id),
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;