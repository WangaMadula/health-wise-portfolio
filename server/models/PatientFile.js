const mongoose = require('mongoose');

const patientFileSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Info
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  idNumber: { type: String, trim: true },
  dateOfBirth: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  // Medical Aid
  medicalAidName: { type: String, trim: true },
  medicalAidNumber: { type: String, trim: true },
  // Emergency Contact
  emergencyContactName: { type: String, trim: true },
  emergencyContactPhone: { type: String, trim: true },
  emergencyContactRelation: { type: String, trim: true },
  // File Info
  fileType: {
    type: String,
    required: true,
    enum: ['medical_history', 'insurance_claim', 'prescription', 'lab_results', 'identification', 'medical_aid_card', 'ID', 'MedicalAid', 'Other', 'other']
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  filePath: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PatientFile', patientFileSchema);