const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const PatientFile = require('../models/PatientFile');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Basic counts
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const totalFiles = await PatientFile.countDocuments();

    // Today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // This week's appointments
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weekAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: startOfWeek,
        $lt: endOfWeek
      }
    });

    // This month's appointments
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const monthAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    });

    // Appointment status breakdown
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment status breakdown
    const paymentsByStatus = await Appointment.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$paymentAmount' }
        }
      }
    ]);

    // Files by status
    const filesByStatus = await PatientFile.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 10 appointments)
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly appointment trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$paymentAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Top services
    const topServices = await Appointment.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      overview: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalFiles,
        todayAppointments,
        weekAppointments,
        monthAppointments
      },
      appointments: {
        byStatus: appointmentsByStatus,
        recent: recentAppointments,
        monthlyTrends,
        topServices
      },
      payments: {
        byStatus: paymentsByStatus
      },
      files: {
        byStatus: filesByStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment analytics
router.get('/appointments/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysBack = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Daily appointment counts
    const dailyStats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' }
          },
          appointments: { $sum: 1 },
          revenue: { $sum: '$paymentAmount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Appointment distribution by hour
    const hourlyDistribution = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$appointmentTime',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Doctor performance
    const doctorStats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$doctor',
          appointments: { $sum: 1 },
          revenue: { $sum: '$paymentAmount' },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $unwind: '$doctorInfo'
      },
      {
        $project: {
          doctorName: '$doctorInfo.name',
          appointments: 1,
          revenue: 1,
          completedAppointments: 1,
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ['$completedAppointments', '$appointments'] }, 100] },
              2
            ]
          }
        }
      },
      {
        $sort: { appointments: -1 }
      }
    ]);

    res.json({
      period: `Last ${daysBack} days`,
      dailyStats,
      hourlyDistribution,
      doctorPerformance: doctorStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get revenue analytics
router.get('/revenue/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '12' } = req.query; // months
    const monthsBack = parseInt(period);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    // Monthly revenue
    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          revenue: { $sum: '$paymentAmount' },
          appointments: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Revenue by service
    const revenueByService = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$service',
          revenue: { $sum: '$paymentAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    // Revenue by payment method
    const revenueByPaymentMethod = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$paymentAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = revenueByService.reduce((sum, service) => sum + service.revenue, 0);

    res.json({
      period: `Last ${monthsBack} months`,
      totalRevenue,
      monthlyRevenue,
      revenueByService,
      revenueByPaymentMethod
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;