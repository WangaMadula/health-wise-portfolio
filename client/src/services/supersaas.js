import axios from 'axios';

class SuperSaaSService {
  constructor() {
    this.apiKey = process.env.REACT_APP_SUPERSAAS_API_KEY || 'YKG64Z52GALErKhYCxtYBA';
    this.accountName = process.env.REACT_APP_SUPERSAAS_ACCOUNT_NAME || 'healthwise-clinic';
    this.baseURL = `https://www.supersaas.com/api`;
  }

  // Create appointment booking
  async createAppointment(appointmentData) {
    try {
      const formData = {
        api_key: this.apiKey,
        schedule_id: '1', // Default schedule ID
        user_id: appointmentData.userId || 'demo-user',
        slot_id: appointmentData.slotId,
        resource_id: appointmentData.doctorId,
        start: appointmentData.startTime,
        finish: appointmentData.endTime,
        title: `${appointmentData.service} - ${appointmentData.patientName}`,
        description: appointmentData.reason || '',
        form_data: {
          patient_name: appointmentData.patientName,
          service: appointmentData.service,
          amount: appointmentData.paymentAmount,
          phone: appointmentData.phone,
          email: appointmentData.email
        }
      };

      // For demo purposes, simulate API call
      console.log('SuperSaaS Appointment Data:', formData);
      
      // Simulate successful response
      return {
        success: true,
        data: {
          id: `supersaas_${Date.now()}`,
          appointment_id: formData.slot_id,
          status: 'confirmed',
          message: 'Appointment successfully created via SuperSaaS',
          ...formData
        }
      };

      // Uncomment below for actual API integration
      /*
      const response = await axios.post(`${this.baseURL}/appointments`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
      */
    } catch (error) {
      console.error('SuperSaaS API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create appointment'
      };
    }
  }

  // Get available time slots
  async getAvailableSlots(scheduleId, date, doctorId) {
    try {
      const params = {
        api_key: this.apiKey,
        schedule_id: scheduleId || '1',
        date: date,
        resource_id: doctorId
      };

      // For demo purposes, return mock available slots
      const mockSlots = this.generateMockSlots(date);
      
      console.log('SuperSaaS Available Slots Request:', params);
      
      return {
        success: true,
        data: mockSlots
      };

      // Uncomment below for actual API integration
      /*
      const response = await axios.get(`${this.baseURL}/free`, { params });
      
      return {
        success: true,
        data: response.data
      };
      */
    } catch (error) {
      console.error('SuperSaaS API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch available slots'
      };
    }
  }

  // Generate mock time slots for demo
  generateMockSlots(date) {
    const slots = [];
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Don't show slots for Sundays or past dates
    if (dayOfWeek === 0 || selectedDate < new Date()) {
      return [];
    }
    
    // Generate morning slots (9:00 AM - 12:00 PM)
    for (let hour = 9; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({
          id: `slot_${hour}_${minute}`,
          start_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          end_time: `${hour}:${(minute + 30) % 60 === 0 ? '30' : '00'}`,
          available: Math.random() > 0.3, // 70% availability
          resource_id: 'doctor_1'
        });
      }
    }
    
    // Generate afternoon slots (2:00 PM - 5:00 PM)
    for (let hour = 14; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        
        slots.push({
          id: `slot_${hour}_${minute}`,
          start_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          end_time: `${hour}:${(minute + 30) % 60 === 0 ? '30' : '00'}`,
          display_time: `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`,
          available: Math.random() > 0.2, // 80% availability
          resource_id: 'doctor_1'
        });
      }
    }
    
    return slots.filter(slot => slot.available);
  }

  // Process payment (integration placeholder)
  async processPayment(paymentData) {
    try {
      // Simulate payment processing
      console.log('Processing payment via SuperSaaS:', paymentData);
      
      // For demo purposes, always return success
      return {
        success: true,
        data: {
          transaction_id: `txn_${Date.now()}`,
          amount: paymentData.amount,
          status: 'completed',
          method: paymentData.method,
          message: 'Payment processed successfully (Demo)'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  }

  // Get appointments for a user
  async getUserAppointments(userId) {
    try {
      const params = {
        api_key: this.apiKey,
        user: userId
      };

      // Mock appointments for demo
      const mockAppointments = [
        {
          id: 'appt_001',
          title: 'General Consultation - John Doe',
          start: new Date().toISOString(),
          service: 'General Consultation',
          doctor: 'Dr. Sarah Johnson',
          status: 'confirmed',
          amount: 250
        }
      ];

      console.log('SuperSaaS Get Appointments Request:', params);
      
      return {
        success: true,
        data: mockAppointments
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch appointments'
      };
    }
  }
}

export default new SuperSaaSService();