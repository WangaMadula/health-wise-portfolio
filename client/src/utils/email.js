// email.js
// Utility to send emails using EmailJS from the browser
// https://www.emailjs.com/docs/examples/reactjs/

import emailjs from 'emailjs-com';

// EmailJS configuration - replace these with your real values from the EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_2xfpp3o';
const EMAILJS_USER_ID = 'L8gwd9wbePDM1q9IY';

/**
 * sendAppointmentConfirmation: legacy helper kept for appointment flows.
 * You can replace TEMPLATE_ID_APPT with your appointment confirmation template id.
 */
export function sendAppointmentConfirmation({ patientEmail, patientName, service, date, time }) {
  const TEMPLATE_ID_APPT = 'template_8e46zxn';
  const templateParams = {
    patient_email: patientEmail, // This will be used as the To field in EmailJS template
    from_email: 'phathutshadzomadula3@gmail.com',
    reply_to: 'phathutshadzomadula3@gmail.com',
    patient_name: patientName,
    service,
    date,
    time
  };
  // Replace any {{patient_email}} in the template params with the actual email
  Object.keys(templateParams).forEach(key => {
    if (typeof templateParams[key] === 'string') {
      templateParams[key] = templateParams[key].replace(/{{patient_email}}/g, patientEmail);
    }
  });
  // Debug: log the params being sent to EmailJS
  console.log('Sending appointment confirmation with params:', templateParams);
  return emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_ID_APPT, templateParams, EMAILJS_USER_ID);
}

/**
 * sendContactMessage
 * Sends the contact form to the clinic admin and a no-reply confirmation to the patient.
 *
 * Required: create two templates in EmailJS and set their IDs below.
 * - TEMPLATE_ID_ADMIN should be a template that sends form details to the clinic (admin).
 * - TEMPLATE_ID_PATIENT should be a template that sends a confirmation email to the patient.
 *
 * Template field names used here (adjust if your templates use different names):
 * - admin template params: patient_name, patient_email, subject, message, phone, preferred_contact
 * - patient template params: patient_name, to_email, confirmation_text
 */
export function sendContactMessage({ name, email, phone, subject, message, preferredContact }) {
  const TEMPLATE_ID_ADMIN = 'template_contact_admin'; // Replace with your actual admin template ID
  const adminParams = {
    patient_name: name,
    patient_email: email,
    subject: subject || 'Website Contact Form',
    message,
    phone: phone || '',
    preferred_contact: preferredContact || 'email'
  };
  // Only send to admin for reliability
  return emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_ID_ADMIN, adminParams, EMAILJS_USER_ID);
}
