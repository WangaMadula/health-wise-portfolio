
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiUsers, FiFileText, FiAlertCircle, FiHeart, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';

// Only allow South African numbers for registration
function validateSouthAfricanPhone(number, countryCode) {
  if (countryCode !== '+27') return false;
  const cleaned = number.replace(/[^\d]/g, '');
  return /^0\d{9}$/.test(cleaned);
}

const PageHeader = styled.section`
  position: relative;
  margin-top: -80px; /* pull behind navbar like other pages */
  padding: 120px 1.5rem 80px; /* add top padding to account for navbar */
  min-height: 85vh; /* make the hero taller to show more of the image */
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/Doctor-with-mum-and-daughter-1-2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 110px 1rem 60px;
    background-attachment: scroll; /* improve mobile performance */
  }
`;

const PageHeaderInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  color: #ffffff;

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    text-shadow: 0 6px 22px rgba(0, 0, 0, 0.55);
  }
  p {
    font-size: 1.2rem;
    color: #f1f5f9;
    text-shadow: 0 3px 14px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    h1 { font-size: 2.2rem; }
    p { font-size: 1.05rem; }
  }
`;

const RegisterContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto 3rem;
  padding: 0 1rem;
`;

const RegisterCard = styled.div`
  background: linear-gradient(135deg, rgba(191, 219, 254, 0.6) 0%, rgba(219, 234, 254, 0.8) 50%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(96, 165, 250, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #a855f7 100%);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1e3a8a;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 1.1rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
`;

const LogoAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  display: block;
  border: 0;
  outline: none;
  box-shadow: none;
  background: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  background: rgba(59, 130, 246, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
`;

const SectionTitle = styled.h3`
  color: #1e3a8a;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: ${props => props.hasIcon ? '2.75rem' : '1rem'};
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:invalid {
    border-color: #ef4444;
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
    background: #fff5f5;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 0.875rem;
  color: #9ca3af;
  pointer-events: none;
`;

const TrailingAction = styled.button`
  position: absolute;
  right: 0.5rem;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const Button = styled.button`
  background: white;
  color: #1a365d;
  border: 2px solid #63b3ed;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:hover {
    background: #3182ce;
    color: white;
    border-color: #3182ce;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(49, 130, 206, 0.18);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  
  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: #1e3a8a;
    }
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const StrengthWrap = styled.div`
  margin-top: 0.4rem;
`;

const StrengthBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 0.25rem;

  span {
    height: 6px;
    border-radius: 4px;
    background: #e2e8f0;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    phoneCountryCode: '+27',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    idType: 'ID',
    idNumber: '',
    medicalAidName: '',
    medicalAidNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // minimal per-field validation on blur
    let message = '';
    if ([ 'firstName','lastName','email','password','confirmPassword','phone','dateOfBirth','address','emergencyContact' ].includes(name) && !value.trim()) {
      message = `${name === 'confirmPassword' ? 'Confirm password' : name.replace(/([A-Z])/g,' $1') } is required`;
    }
    // Name/Surname validation: disallow '00'
    if (!message && (name === 'firstName' || name === 'lastName')) {
      if (value.trim() === '00') {
        message = `${name === 'firstName' ? 'First name' : 'Last name'} cannot be '00'`;
      }
    }
    // Email validation: only allow lowercase letters, up to 3 numbers, must end with @gmail.com, disallow '00@gmail.com'
    if (!message && name === 'email' && value.trim()) {
      const emailRegex = /^[a-z]+\d{0,3}@gmail\.com$/;
      if (value.trim() === '00@gmail.com' || !emailRegex.test(value.trim())) {
        message = 'Email must be lowercase letters (optionally up to 3 numbers) and end with @gmail.com';
      }
    }
    if (!message && name === 'password' && value && value.length < 6) {
      message = 'Password must be at least 6 characters';
    }
    if (!message && name === 'confirmPassword' && value && value !== formData.password) {
      message = 'Passwords do not match';
    }
    if (message) {
      setErrors(prev => ({ ...prev, [name]: message }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneCountryCode') {
      setFormData(prev => ({ ...prev, phoneCountryCode: value }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim() === '00') {
      newErrors.firstName = "First name cannot be '00'";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim() === '00') {
      newErrors.lastName = "Last name cannot be '00'";
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-z]+\d{0,3}@gmail\.com$/;
      if (formData.email.trim() === '00@gmail.com' || !emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Email must be lowercase letters (optionally up to 3 numbers) and end with @gmail.com';
      }
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      // At least 6 characters, one capital, one number, one symbol
      const pw = formData.password;
      if (pw.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!/[A-Z]/.test(pw)) {
        newErrors.password = 'Password must contain at least one capital letter';
      } else if (!/\d/.test(pw)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[^A-Za-z0-9]/.test(pw)) {
        newErrors.password = 'Password must contain at least one symbol';
      }
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim() === '00') {
      newErrors.phone = "Phone number cannot be '00'";
    } else if (!validateSouthAfricanPhone(formData.phone, formData.phoneCountryCode)) {
      newErrors.phone = 'Please enter a valid South African phone number (10 digits, starting with 0)';
    }
    if (!formData.phoneCountryCode) newErrors.phoneCountryCode = 'Phone country code is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else {
      // Accept addresses like '123 Kempton Street, Gauteng, 0611'
      // Only validate that the first part is numeric (street number)
      const addressParts = formData.address.trim().split(/\s+/);
      const streetNumber = addressParts[0];
      if (!/^[0-9]+$/.test(streetNumber)) {
        newErrors.address = 'Street number must be numeric.';
      }
      // Allow any street name, city, and postal code after the number
    }
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    // ID/Passport validation
    if (formData.idType === 'ID') {
      if (formData.idNumber && formData.idNumber.trim() === '00') {
        newErrors.idNumber = "ID number cannot be '00'";
      } else if (formData.idNumber && !/^\d{13}$/.test(formData.idNumber)) {
        newErrors.idNumber = 'South African ID must be exactly 13 digits';
      }
    } else if (formData.idType === 'Passport') {
      if (formData.idNumber && formData.idNumber.trim() === '00') {
        newErrors.idNumber = "Passport number cannot be '00'";
      } else if (formData.idNumber && !/^\d{8}$/.test(formData.idNumber)) {
        newErrors.idNumber = 'Passport number must be exactly 8 digits';
      }
    }
    // Medical aid member number: must be exactly 9 digits if provided
    if (formData.medicalAidNumber && formData.medicalAidNumber.trim() === '00') {
      newErrors.medicalAidNumber = "Medical Aid Member Number cannot be '00'";
    } else if (formData.medicalAidNumber && !/^\d{9}$/.test(formData.medicalAidNumber)) {
      newErrors.medicalAidNumber = 'Medical Aid Member Number must be exactly 9 digits';
    }
    // Optional field: medicalAidName (no hard validation)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result?.success) {
        toast.success('Registration successful! Welcome to HealthWise Clinic!');
        navigate('/');
      } else {
        toast.error(result?.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader>
        <PageHeaderInner>
          <h1>Create Your Account</h1>
          <p>Book appointments, manage files, and stay connected with your care team.</p>
        </PageHeaderInner>
      </PageHeader>
      <RegisterContainer>
        <RegisterCard>
        <LogoWrapper>
          <LogoAvatar>
            <LogoImage src="/logo3.png" alt="Healthwise Clinic" />
          </LogoAvatar>
        </LogoWrapper>
        <Title>Join HealthWise Clinic</Title>
        <Subtitle>
          Create your patient account to book appointments, securely file documents, and manage your health with our care team.
        </Subtitle>
        
        <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <FormSection>
              <SectionTitle>
                <FiUser />
                Personal Information
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>First Name *</Label>
                  <InputWrapper>
                    <Icon><FiUser /></Icon>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      hasIcon
                      required
                    />
                  </InputWrapper>
                  {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Last Name *</Label>
                  <InputWrapper>
                    <Icon><FiUser /></Icon>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      hasIcon
                      required
                    />
                  </InputWrapper>
                  {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>Date of Birth *</Label>
                  <InputWrapper>
                    <Icon><FiCalendar /></Icon>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      hasIcon
                      required
                    />
                  </InputWrapper>
                  {errors.dateOfBirth && <ErrorText>{errors.dateOfBirth}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone Number *</Label>
                  <InputWrapper>
                    <Icon><FiPhone /></Icon>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+27"
                      hasIcon
                      required
                    />
                  </InputWrapper>
                  {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* Contact Information */}
            <FormSection>
              <SectionTitle>
                <FiMail />
                Contact & Account Information
              </SectionTitle>
              
              <FormGroup>
                <Label>Email Address *</Label>
                <InputWrapper>
                  <Icon><FiMail /></Icon>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    hasIcon
                    required
                  />
                </InputWrapper>
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label>Password *</Label>
                  <InputWrapper>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Minimum 6 characters"
                      aria-invalid={Boolean(errors.password)}
                      required
                    />
                    <TrailingAction type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </TrailingAction>
                  </InputWrapper>
                  <StrengthWrap>
                    <StrengthBar>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} style={{ background: i < passwordStrength(formData.password) ? (i < 2 ? '#f59f00' : '#22c55e') : '#e2e8f0' }} />
                      ))}
                    </StrengthBar>
                  </StrengthWrap>
                  {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Confirm Password *</Label>
                  <InputWrapper>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Re-enter password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      required
                    />
                    <TrailingAction type="button" onClick={() => setShowConfirmPassword(s => !s)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </TrailingAction>
                  </InputWrapper>
                  {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label>Address *</Label>
                <InputWrapper>
                  <Icon><FiMapPin /></Icon>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State, ZIP"
                    hasIcon
                    required
                  />
                </InputWrapper>
                {errors.address && <ErrorText>{errors.address}</ErrorText>}
              </FormGroup>
              
              <FormGroup>
                <Label>Emergency Contact *</Label>
                <InputWrapper>
                  <Icon><FiUsers /></Icon>
                  <Input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Name and phone number"
                    hasIcon
                    required
                  />
                </InputWrapper>
                {errors.emergencyContact && <ErrorText>{errors.emergencyContact}</ErrorText>}
              </FormGroup>
            </FormSection>

            {/* Identity & Medical Aid (Optional) */}
            <FormSection>
              <SectionTitle>
                <FiFileText />
                Identity & Medical Aid (Optional)
              </SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>ID Type</Label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    style={{ padding: '0.7rem 1rem', borderRadius: 8, border: '2px solid #e5e7eb', fontSize: '1rem' }}
                  >
                    <option value="ID">South African ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label>{formData.idType === 'ID' ? 'South African ID Number' : 'Passport Number'}</Label>
                  <Input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder={formData.idType === 'ID' ? 'e.g. 9001015800087' : 'Enter passport number'}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Medical Aid Scheme</Label>
                  <Input
                    type="text"
                    name="medicalAidName"
                    value={formData.medicalAidName}
                    onChange={handleChange}
                    placeholder="e.g. Discovery, Momentum, Bonitas"
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label>Medical Aid Member Number</Label>
                <Input
                  type="text"
                  name="medicalAidNumber"
                  value={formData.medicalAidNumber}
                  onChange={handleChange}
                  placeholder="Enter member number"
                />
              </FormGroup>
              <SmallNote>
                These details are optional and can be completed later in your profile or during filing.
              </SmallNote>
            </FormSection>

            {/* Medical Information */}
            <FormSection>
              <SectionTitle>
                <FiFileText />
                Medical Information (Optional)
              </SectionTitle>
              
              <FormGroup>
                <Label>Medical History</Label>
                <TextArea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Previous surgeries, chronic conditions, major illnesses..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Allergies</Label>
                <InputWrapper>
                  <Icon><FiAlertCircle /></Icon>
                  <Input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Drug allergies, food allergies, environmental allergies..."
                    hasIcon
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <Label>Current Medications</Label>
                <InputWrapper>
                  <Icon><FiHeart /></Icon>
                  <Input
                    type="text"
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    placeholder="List current medications and dosages..."
                    hasIcon
                  />
                </InputWrapper>
              </FormGroup>
            </FormSection>

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Patient Account'}
            </Button>
          </Form>
          
          <LoginLink>
            Already have an account? <Link to="/login">Sign in here</Link>
          </LoginLink>
        </RegisterCard>
      </RegisterContainer>
    </>
  );
};

export default Register;

// Local styled helper for a subtle note text
const SmallNote = styled.p`
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
`;