const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();
const nodemailer = require('nodemailer');


// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, service, reason, paymentAmount } = req.body;

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor selected' });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      service,
      reason,
      paymentAmount
    });

    await appointment.save();
    await appointment.populate('doctor', 'name email specialization');
    await appointment.populate('patient', 'name email phone');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });

    // Email sending is handled by /sendBookingEmail route in frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();
    await appointment.populate('doctor', 'name email specialization');
    await appointment.populate('patient', 'name email phone');

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status
router.put('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns this appointment or is admin
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && 
        appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.paymentStatus = paymentStatus;
    if (paymentMethod) {
      appointment.paymentMethod = paymentMethod;
    }

    await appointment.save();

    res.json({
      message: 'Payment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
// Cancel appointment (with reason)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns this appointment or is admin
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && 
        appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = 'cancelled';
    if (reason) appointment.reason = reason;
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;