import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaHospitalAlt, FaRegCreditCard } from 'react-icons/fa';
import styled from 'styled-components';
import { toast } from 'react-toastify';


const ContactContainer = styled.div`
  min-height: 100vh;
  margin-top: -80px; /* pull content up to sit behind the navbar */
`;

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  padding-top: 80px; /* add padding back to account for navbar height and prevent text overlap */
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    font-weight: 700;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.3rem;
    line-height: 1.6;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const ContentSection = styled.div`
  background: #f0f4f8;
  color: #2c3e50;
  padding: 5rem 2rem 3rem;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem 2rem;
  }
`;

const FormSection = styled.div`
  background: white;
  color: #2c3e50;
  padding: 5rem 2rem;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const FormSectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3c72;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 2px;
    }
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    color: #6c757d;
    max-width: 600px;
    margin: 1.5rem auto 0;
  }
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Removed unused SectionTitle to clean up warnings

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3c72;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    padding: 0 2.5rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 2px;
    }
    
    /* Add decorative side lines */
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 35px;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #2a5298 100%);
    }
    
    @media (max-width: 768px) {
      font-size: 2rem;
      padding: 0 1rem;
      
      &::before {
        width: 20px;
      }
    }
  }
  
  p {
    font-size: 1.1rem;
    color: #6c757d;
    max-width: 600px;
    margin: 1.5rem auto 0;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2.5rem;
  animation: fadeInUp 0.6s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Stagger animation for cards */
  & > *:nth-child(1) { animation-delay: 0.1s; animation: fadeInUp 0.6s ease-out 0.1s both; }
  & > *:nth-child(2) { animation-delay: 0.2s; animation: fadeInUp 0.6s ease-out 0.2s both; }
  & > *:nth-child(3) { animation-delay: 0.3s; animation: fadeInUp 0.6s ease-out 0.3s both; }
  & > *:nth-child(4) { animation-delay: 0.4s; animation: fadeInUp 0.6s ease-out 0.4s both; }
  & > *:nth-child(5) { animation-delay: 0.5s; animation: fadeInUp 0.6s ease-out 0.5s both; }
  & > *:nth-child(6) { animation-delay: 0.6s; animation: fadeInUp 0.6s ease-out 0.6s both; }
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const ContactCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
    transform-origin: left;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(30, 60, 114, 0.15);
    border-color: #1e3c72;
    
    &::before {
      transform: scaleX(1);
    }
    
    h3 {
      color: #2a5298;
      transform: translateX(4px);
    }
  }
  
  h3 {
    color: #1e3c72;
    margin-bottom: 1.25rem;
    font-size: 1.3rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
    
    /* Make emoji larger and more prominent */
    &::first-letter {
      font-size: 1.5em;
    }
  }
  
  p {
    margin: 0.75rem 0;
    line-height: 1.8;
    color: #495057;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    padding-left: 1.5rem;
    position: relative;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0.5rem;
      color: #2a5298;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    strong {
      color: #2c3e50;
      font-weight: 600;
      display: inline-block;
      transition: color 0.3s ease;
    }
  }
  
  &:hover p {
    color: #2c3e50;
    
    &::before {
      opacity: 1;
    }
    
    strong {
      color: #1e3c72;
    }
  }
  
  /* Add subtle background pattern on hover */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(30, 60, 114, 0.03) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const ContactForm = styled.form`
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.6) 0%, rgba(219, 234, 254, 0.8) 50%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(147, 197, 253, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
    font-size: 0.95rem;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.85rem;
    border: 1px solid #ced4da;
    border-radius: 8px;
    background: #f8f9fa;
    color: #2c3e50;
    font-size: 1rem;
    transition: all 0.2s ease;
    font-family: inherit;
    
    &::placeholder {
      color: #adb5bd;
    }
    
    &:focus {
      outline: none;
      border-color: #1e3c72;
      background: white;
      box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
    }

    &[aria-invalid="true"] {
      border-color: #e03131;
      background: #fff5f5;
      box-shadow: 0 0 0 3px rgba(224, 49, 49, 0.1);
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ErrorText = styled.div`
  margin-top: 0.5rem;
  color: #e03131;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Testimonials styles
const TestimonialsSection = styled.section`
  position: relative;
  padding: 5rem 2rem;
  background:
    radial-gradient(1200px 400px at -5% -10%, rgba(42, 82, 152, 0.08), transparent 60%),
    radial-gradient(900px 300px at 105% 0%, rgba(30, 60, 114, 0.08), transparent 60%),
    linear-gradient(180deg, #f7faff 0%, #eef3fb 100%);
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 420px;
    height: 420px;
    filter: blur(60px);
    opacity: 0.25;
    border-radius: 50%;
    pointer-events: none;
  }

  &::before {
    background: radial-gradient(circle, rgba(42, 82, 152, 0.25), transparent 60%);
    top: -160px;
    left: -120px;
  }

  &::after {
    background: radial-gradient(circle, rgba(30, 60, 114, 0.25), transparent 60%);
    bottom: -160px;
    right: -120px;
  }
  
  @media (max-width: 768px) {
    padding: 3.5rem 1.25rem;
  }
`;

const TestimonialsContent = styled.div`
   position: relative;
   z-index: 1;
   max-width: 1200px;
   margin: 0 auto;
`;

const TestimonialsHeader = styled.div`
  text-align: center;
  margin-bottom: 2.25rem;

  h2 {
    font-size: 2.25rem;
    color: #1e3c72;
    font-weight: 800;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    padding: 0 2rem;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -8px;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 2px;
    }
  }
  p {
    color: #6c757d;
    font-size: 1.05rem;
    max-width: 680px;
    margin: 1rem auto 0;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  & > *:nth-child(1) { animation: fadeInUp 0.6s ease-out 0.1s both; }
  & > *:nth-child(2) { animation: fadeInUp 0.6s ease-out 0.2s both; }
  & > *:nth-child(3) { animation: fadeInUp 0.6s ease-out 0.3s both; }
  & > *:nth-child(4) { animation: fadeInUp 0.6s ease-out 0.4s both; }
  & > *:nth-child(5) { animation: fadeInUp 0.6s ease-out 0.5s both; }
  & > *:nth-child(6) { animation: fadeInUp 0.6s ease-out 0.6s both; }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// A moving, subtle glow that follows the cursor
const TestimonialsGlow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    600px 300px at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%),
    rgba(42, 82, 152, 0.08),
    transparent 60%
  );
  transition: background-position 0.1s ease-out;
`;

const TestimonialCard = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;

  &::before {
    content: '“';
    position: absolute;
    top: -10px;
    right: 16px;
    font-size: 5rem;
    line-height: 1;
    color: rgba(30, 60, 114, 0.08);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(30, 60, 114, 0.15);
    border-color: #dbe2ea;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.75rem;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
`;

const Person = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  strong {
    color: #1e3c72;
  }
  span {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const Stars = styled.div`
  color: #f59f00; /* Amber */
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
`;

const Quote = styled.p`
  color: #2c3e50;
  line-height: 1.7;
  margin: 0.25rem 0 0;
`;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  // const testimonialsRef = useRef(null);
  // const [glowPos, setGlowPos] = useState({ x: 0.5, y: 0.5 });
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setParallaxOffset(-(y * 0.25));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerStyle = {
    backgroundImage: 'url("/Doctor-with-mum-and-daughter-1-2.jpg")',
    backgroundPosition: `center ${parallaxOffset}px`
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // clear error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length === 0 ? 'Please enter your full name.' : '';
      case 'email': {
        if (value.trim().length === 0) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address (e.g., name@example.com).';
      }
      case 'message':
        return value.trim().length === 0 ? 'Please enter your message.' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    if (msg) {
      setErrors(prev => ({ ...prev, [name]: msg }));
    }
  };

  const handleInvalid = (e) => {
    const { name, validity } = e.target;
    let msg = '';
    if (validity.valueMissing) {
      if (name === 'name') msg = 'Please enter your full name.';
      else if (name === 'email') msg = 'Please enter your email address.';
      else if (name === 'message') msg = 'Please enter your message.';
    } else if (validity.typeMismatch || validity.patternMismatch) {
      if (name === 'email') msg = 'Please enter a valid email address (e.g., name@example.com).';
    }
    e.target.setCustomValidity(msg);
  };

  const handleInputClear = (e) => {
    // clear browser validation message as user edits
    e.target.setCustomValidity('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.message) {
      toast.error('Please correct the highlighted fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      // No longer sending via EmailJS. Just show confirmation and clear form.
      toast.success('Your message has been received. We will get back to you within 24–48 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleTestimonialsMouseMove = (e) => {};
  // const handleTestimonialsMouseLeave = () => {};

  return (
    <ContactContainer>
      {/* Hero Section with Background Image */}
      <HeroSection style={headerStyle}>
        <HeroContent>
          <h1>Contact Us</h1>
          <p>Get in touch with us for any questions or to schedule an appointment</p>
        </HeroContent>
      </HeroSection>
      
      {/* Content Section with Contact Info and Form */}
      <ContentSection>
        <ContactContent>
          <ContactHeader>
            <h2>Get In Touch</h2>
            <p>We're here to help and answer any questions you might have</p>
          </ContactHeader>
          
          <ContactGrid>
            <ContactCard>
              <h3><FaMapMarkerAlt style={{ color: '#1e3c72', marginRight: 8 }} /> Our Location</h3>
              <p><strong>HealthWise Medical Center</strong></p>
              <p>247 Oxford Road</p>
              <p>Rosebank Medical Centre</p>
              <p>Johannesburg, Gauteng 2196</p>
              <p><strong>Parking:</strong> Free patient parking</p>
              <p><strong>Accessibility:</strong> Wheelchair accessible</p>
            </ContactCard>

            <ContactCard>
              <h3><FaPhoneAlt style={{ color: '#1e3c72', marginRight: 8 }} /> Contact Numbers</h3>
              <p><strong>Main Reception:</strong> 011 253 4567</p>
              <p><strong>Appointments:</strong> 087 550 1234</p>
              <p><strong>Emergency Line:</strong> 010 911 1234</p>
              <p><strong>WhatsApp:</strong> +27 72 123 4567</p>
              <p><strong>Pharmacy:</strong> 011 253 4570</p>
            </ContactCard>

            <ContactCard>
              <h3><FaEnvelope style={{ color: '#1e3c72', marginRight: 8 }} /> Email Services</h3>
              <p><strong>General:</strong> info@healthwise.clinic</p>
              <p><strong>Appointments:</strong> appointments@healthwise.clinic</p>
              <p><strong>Records:</strong> records@healthwise.clinic</p>
              <p><strong>Billing:</strong> billing@healthwise.clinic</p>
              <p><strong>Emergency:</strong> emergency@healthwise.clinic</p>
            </ContactCard>

            <ContactCard>
              <h3><FaClock style={{ color: '#1e3c72', marginRight: 8 }} /> Operating Hours</h3>
              <p><strong>Monday - Friday:</strong> 7:00 AM - 8:00 PM</p>
              <p><strong>Saturday:</strong> 8:00 AM - 4:00 PM</p>
              <p><strong>Sunday:</strong> 10:00 AM - 2:00 PM (Urgent Care)</p>
              <p><strong>Emergency:</strong> 24/7 Available</p>
            </ContactCard>

            <ContactCard>
              <h3><FaHospitalAlt style={{ color: '#1e3c72', marginRight: 8 }} /> Departments</h3>
              <p>General Medicine</p>
              <p>Family Practice</p>
              <p>Pediatrics</p>
              <p>Cardiology</p>
              <p>Orthopedics</p>
              <p>Mental Health</p>
            </ContactCard>

            <ContactCard>
              <h3><FaRegCreditCard style={{ color: '#1e3c72', marginRight: 8 }} /> Insurance Accepted</h3>
              <p>Blue Cross Blue Shield</p>
              <p>Aetna & Cigna</p>
              <p>Medicare & Medicaid</p>
              <p>UnitedHealth</p>
              <p>Payment Plans Available</p>
            </ContactCard>
          </ContactGrid>
        </ContactContent>
      </ContentSection>
      
      {/* Form Section */}
      <FormSection>
        <FormSectionContent>
          <FormHeader>
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible</p>
          </FormHeader>
          
          <ContactForm onSubmit={handleSubmit} noValidate>

            <FormRow>
              <FormGroup>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onInvalid={handleInvalid}
                  onInput={handleInputClear}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onInvalid={handleInvalid}
                  onInput={handleInputClear}
                  aria-invalid={Boolean(errors.email)}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </FormGroup>
              
              <FormGroup>
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <label>Preferred Contact Method</label>
              <select
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
              >
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
                <option value="text">Text Message</option>
              </select>
            </FormGroup>
            
            <FormGroup>
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                onInvalid={handleInvalid}
                onInput={handleInputClear}
                aria-invalid={Boolean(errors.message)}
                placeholder="Please describe your inquiry, symptoms, or reason for contacting us..."
                required
              ></textarea>
              {errors.message && <ErrorText>{errors.message}</ErrorText>}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>
        </FormSectionContent>
      </FormSection>

      {/* Testimonials Section removed as requested */}
    </ContactContainer>
  );
};

export default ContactUs;