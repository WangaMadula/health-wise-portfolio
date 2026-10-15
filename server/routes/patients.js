const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const PatientFile = require('../models/PatientFile');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all patients
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { role: 'patient' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Get appointment counts for each patient
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ 
          patient: patient._id 
        });
        const fileCount = await PatientFile.countDocuments({ 
          patient: patient._id 
        });
        
        return {
          ...patient.toObject(),
          appointmentCount,
          fileCount
        };
      })
    );

    res.json({
      patients: patientsWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient details
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get patient's appointments
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1 })
      .limit(10);

    // Get patient's files
    const files = await PatientFile.find({ patient: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      patient,
      recentAppointments: appointments,
      recentFiles: files
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient status
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.isActive = isActive;
    await patient.save();

    res.json({
      message: `Patient ${isActive ? 'activated' : 'deactivated'} successfully`,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        isActive: patient.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient statistics
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const activePatients = await User.countDocuments({ 
      role: 'patient', 
      isActive: true 
    });
    
    // Patients registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newPatientsThisMonth = await User.countDocuments({
      role: 'patient',
      createdAt: { $gte: startOfMonth }
    });

    // Age distribution
    const patients = await User.find({ 
      role: 'patient',
      dateOfBirth: { $exists: true, $ne: null }
    }).select('dateOfBirth');

    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };

    patients.forEach(patient => {
      const age = Math.floor((Date.now() - patient.dateOfBirth) / (1000 * 60 * 60 * 24 * 365.25));
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
    });

    res.json({
      totalPatients,
      activePatients,
      inactivePatients: totalPatients - activePatients,
      newPatientsThisMonth,
      ageDistribution: ageGroups
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;