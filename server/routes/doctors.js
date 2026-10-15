const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, available } = req.query;
    const query = { role: 'doctor', isActive: true };

    if (available === 'true') {
      // Add logic for available doctors based on schedule
    }

    const doctors = await User.find(query)
      .select('-password')
      .sort({ name: 1 });

    // Get doctor details from Doctor model
    const doctorsWithDetails = await Promise.all(
      doctors.map(async (doctor) => {
        const doctorDetails = await Doctor.findOne({ user: doctor._id });
        return {
          ...doctor.toObject(),
          doctorDetails
        };
      })
    );

    let filteredDoctors = doctorsWithDetails;

    if (specialization) {
      filteredDoctors = doctorsWithDetails.filter(doctor => 
        doctor.doctorDetails && 
        doctor.doctorDetails.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    res.json({ doctors: filteredDoctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorDetails = await Doctor.findOne({ user: req.params.id });

    res.json({
      doctor: {
        ...doctor.toObject(),
        doctorDetails
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create doctor profile (admin only)
router.post('/profile', adminAuth, async (req, res) => {
  try {
    const { 
      userId, 
      specialization, 
      licenseNumber, 
      experience, 
      education, 
      workingHours, 
      consultationFee, 
      bio 
    } = req.body;

    // Check if user exists and is a doctor
    const user = await User.findById(userId);
    if (!user || user.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor user' });
    }

    // Check if doctor profile already exists
    let doctorProfile = await Doctor.findOne({ user: userId });
    if (doctorProfile) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    doctorProfile = new Doctor({
      user: userId,
      specialization,
      licenseNumber,
      experience,
      education,
      workingHours,
      consultationFee,
      bio
    });

    await doctorProfile.save();
    await doctorProfile.populate('user', 'name email phone');

    res.status(201).json({
      message: 'Doctor profile created successfully',
      doctor: doctorProfile
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'License number already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile
router.put('/profile/:id', adminAuth, async (req, res) => {
  try {
    const { 
      specialization, 
      experience, 
      education, 
      workingHours, 
      consultationFee, 
      bio,
      isAvailable
    } = req.body;

    const doctorProfile = await Doctor.findById(req.params.id);
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Update fields
    if (specialization) doctorProfile.specialization = specialization;
    if (experience !== undefined) doctorProfile.experience = experience;
    if (education) doctorProfile.education = education;
    if (workingHours) doctorProfile.workingHours = workingHours;
    if (consultationFee !== undefined) doctorProfile.consultationFee = consultationFee;
    if (bio) doctorProfile.bio = bio;
    if (isAvailable !== undefined) doctorProfile.isAvailable = isAvailable;

    await doctorProfile.save();
    await doctorProfile.populate('user', 'name email phone');

    res.json({
      message: 'Doctor profile updated successfully',
      doctor: doctorProfile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's schedule
router.get('/:id/schedule', async (req, res) => {
  try {
    const { date } = req.query;
    
    const doctorProfile = await Doctor.findOne({ user: req.params.id });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get day of week for the requested date
    const requestedDate = new Date(date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[requestedDate.getDay()];

    const daySchedule = doctorProfile.workingHours[dayName];
    
    if (!daySchedule || !daySchedule.available) {
      return res.json({ 
        available: false, 
        message: 'Doctor is not available on this day' 
      });
    }

    // Generate time slots (example: 30-minute slots)
    const timeSlots = generateTimeSlots(daySchedule.start, daySchedule.end);

    res.json({
      available: true,
      workingHours: daySchedule,
      timeSlots
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime) {
  const slots = [];
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  let current = new Date(start);
  
  while (current < end) {
    const timeString = current.toTimeString().slice(0, 5);
    slots.push(timeString);
    current.setMinutes(current.getMinutes() + 30); // 30-minute slots
  }
  
  return slots;
}

module.exports = router;