import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
// import { FiUpload, FiFile, FiX, FiCheck, FiUser, FiCalendar, FiPhone, FiMail } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { db } from '../firebase';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { countryCodes, validatePhoneNumber } from '../utils/phoneUtils';

const FilingContainer = styled.div`
  min-height: 100vh;
  background: none;
  color: #22223b;
  padding-bottom: 8px;
  margin-top: 0 !important;
  padding-top: 0 !important;
  box-sizing: border-box;
`;

const HeroSection = styled.section`
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  min-height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image: url('/Doctor-with-mum-and-daughter-1-2.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin-top: -56px;
  padding: 0;
  border: none;
  z-index: 0;
  box-sizing: border-box;
`;


// No overlay present

const HeroText = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  color: #2d0066;
  width: 100vw;
  padding: 4.5rem 0 2.5rem 0;
  h1 {
    font-size: 2.7rem;
    font-weight: 900;
    margin-bottom: 0.7rem;
    color: #7c3aed;
    text-shadow: 0 2px 8px rgba(124,58,237,0.08);
    letter-spacing: 0.5px;
  }
  p {
    color: #4b5563;
    font-size: 1.18rem;
    margin: 0;
    font-weight: 500;
    text-shadow: 0 1px 4px rgba(255,255,255,0.13);
  }
`;

const FilingContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0.4rem 0.4rem 0.7rem 0.4rem;
  padding-top: 120px;
  background: none;
  border-radius: 0;
  box-shadow: none;
`;



const FilingForm = styled.form`
  position: relative;
  background: rgba(255, 255, 255, 0.22);
  padding: 4rem 3.5rem 4.5rem 3.5rem;
  border-radius: 32px;
  border: 6px solid rgba(168, 85, 247, 0.55);
  box-shadow: 0 8px 64px 0 rgba(124,58,237,0.25), 0 1.5px 32px 0 rgba(168,85,247,0.18);
  outline: 1.5px solid rgba(255,255,255,0.45);
  max-width: 900px;
  width: 90%;
  margin: -5rem auto 2.5rem auto;
  z-index: 2;
  color: #2d0066;
  overflow: hidden;
  /* Fallback for browsers without backdrop-filter */
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background: rgba(120, 118, 118, 0.92);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: inherit;
    backdrop-filter: blur(40px) saturate(2.5);
    -webkit-backdrop-filter: blur(40px) saturate(2.5);
    border-radius: inherit;
    pointer-events: none;
  }
  > * {
    position: relative;
    z-index: 1;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2.2rem;
  h3 {
    color: #a855f7;
    margin-bottom: 1.2rem;
    font-size: 1.18rem;
    border-bottom: 2px solid rgba(168, 85, 247, 0.22);
    padding-bottom: 0.5rem;
  }
  &.personal-info-blur {
    background: rgba(255, 255, 255, 0.34);
    backdrop-filter: blur(32px) saturate(1.3);
    -webkit-backdrop-filter: blur(32px) saturate(1.3);
    border-radius: 18px;
    border: 2.5px solid #a855f7;
    box-shadow: 0 8px 32px rgba(124,58,237,0.13);
    outline: 1.5px solid rgba(255,255,255,0.25);
    padding: 2rem 1.5rem 2.2rem 1.5rem;
    margin-bottom: 2.5rem;
    /* Make text more readable on blur */
    color: #2d0066;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #a855f7;
    font-weight: 500;
  }
  input, select {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid #a855f7;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.38);
    color: #22223b;
    font-size: 1.05rem;
    &::placeholder {
      color: #888;
    }
    &:focus {
      outline: none;
      border-color: #a855f7;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
    }
    option {
      background: rgba(255, 255, 255, 0.38);
      color: #22223b;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FileUploadSection = styled.div`
  border: 2px dashed rgba(168, 85, 247, 0.5);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #a855f7;
    background: rgba(168, 85, 247, 0.05);
  }
  
  input[type="file"] {
    display: none;
  }
  
  label {
    cursor: pointer;
    color: #a855f7;
    font-weight: 500;
  }
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FileItem = styled.li`
  background: #f3e8ff;
  color: #7c3aed;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.98rem;
`;

const RemoveFileBtn = styled.button`
  background: white;
  color: #1a365d;
  border: 2px solid #63b3ed;
  border-radius: 6px;
  padding: 0.3rem 0.7rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #3182ce;
    color: white;
    border-color: #3182ce;
    transform: translateY(-1px);
  }
`;
const Small = styled.small`
  display: block;
  opacity: 0.85;
`;

const SubmitButton = styled.button`
  background: white;
  color: #1a365d;
  border: 2px solid #63b3ed;
  padding: 1rem 2.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:hover {
    background: #3182ce;
    color: white;
    border-color: #3182ce;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(49, 130, 206, 0.18);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;


const Filing = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    idNumber: '',
    dateOfBirth: user?.profile?.dateOfBirth || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
      phoneCountryCode: '+27',
    address: user?.profile?.address || '',
    medicalAidName: '',
    medicalAidNumber: '',
    emergencyContactName: user?.profile?.emergencyContact?.split(' - ')[0] || '',
    emergencyContactPhone: user?.profile?.emergencyContact?.split(' - ')[1] || '',
    emergencyContactRelation: '',
    fileType: '',
    description: ''
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // Removed parallax JS logic, using CSS background-attachment: fixed

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type. Please upload PDF, JPEG, or PNG files.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    // Read files as base64 and store in state
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          base64: event.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

// Only allow South African numbers
function validatePhoneNumber(number) {
  // South African numbers: 10 digits, must start with 0 (e.g., 0821234567)
  const cleaned = number.replace(/[^\d]/g, '');
  return /^0\d{9}$/.test(cleaned);
}

  const handleRemoveFile = (index) => {
    setFiles(files => files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }
    // Name/Surname validation: disallow '00'
    if (formData.firstName.trim() === '00') {
      toast.error("First name cannot be '00'");
      return;
    }
    if (formData.lastName.trim() === '00') {
      toast.error("Last name cannot be '00'");
      return;
    }
    if (formData.emergencyContactName && formData.emergencyContactName.trim() === '00') {
      toast.error("Emergency contact name cannot be '00'");
      return;
    }
    // Email validation: only allow lowercase letters, up to 3 numbers, must end with @gmail.com, disallow '00@gmail.com'
    const emailRegex = /^[a-z]+\d{0,3}@gmail\.com$/;
    if (formData.email.trim() === '00@gmail.com' || !emailRegex.test(formData.email.trim())) {
      toast.error('Email must be lowercase letters (optionally up to 3 numbers) and end with @gmail.com');
      return;
    }
    // Professional, single error message for phone validation
    if (!validatePhoneNumber(formData.phone) || !validatePhoneNumber(formData.emergencyContactPhone)) {
      toast.error('Please enter valid South African phone numbers (10 digits, starting with 0) for both your phone and emergency contact.');
      return;
    }
    setIsSubmitting(true);
    setUploadSuccess(false);
    try {
      // Save files and metadata to localStorage
      const userFilesKey = `user_files_${user?.uid || user?.email}`;
      const existing = JSON.parse(localStorage.getItem(userFilesKey) || '[]');
      const newFiles = files.map(f => ({
        ...f,
        uploadedAt: new Date().toISOString(),
        ...formData
      }));
      localStorage.setItem(userFilesKey, JSON.stringify([...existing, ...newFiles]));
      setUploadSuccess(true);
      toast.success(`${newFiles.length} file(s) uploaded successfully!`);
      setFormData({
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        idNumber: '',
        dateOfBirth: user?.profile?.dateOfBirth || '',
        email: user?.email || '',
        phone: user?.profile?.phone || '',
        address: user?.profile?.address || '',
        medicalAidName: '',
        medicalAidNumber: '',
        emergencyContactName: user?.profile?.emergencyContact?.split(' - ')[0] || '',
        emergencyContactPhone: user?.profile?.emergencyContact?.split(' - ')[1] || '',
        emergencyContactRelation: '',
        fileType: '',
        description: ''
      });
      setFiles([]);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FilingContainer>
      <HeroSection>
        <HeroText>
          <h1>Patient Document Filing</h1>
          <p>Securely upload your personal and medical documents to create or update your patient record at Healthwise Clinic.</p>
        </HeroText>
      </HeroSection>
      {/* Subheading below the hero image */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        textAlign: 'center',
  marginTop: '64px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 3
      }}>
        <h2 style={{
          fontSize: '1.45rem',
          fontWeight: 600,
          color: '#7c3aed',
          margin: 0,
          letterSpacing: '0.2px',
          textShadow: '0 1px 4px rgba(124,58,237,0.08)'
        }}>
          Upload and manage your medical records securely
        </h2>
      </div>
      <FilingContent>
        {uploadSuccess && (
          <div style={{
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            border: '1.5px solid #34d399',
            textAlign: 'center',
            fontWeight: 500
          }}>
            Files uploaded successfully!
          </div>
        )}
        <FilingForm onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <FormSection>
            <h3>Personal Information</h3>
            <FormRow>
              <FormGroup>
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <label>ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your ID number"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="yyyy/mm/dd"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="patient@healthwise.clinic"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your full address"
              />
            </FormGroup>
          </FormSection>

          {/* Medical Aid Information Section */}
          <FormSection>
            <h3>Medical Aid Information</h3>
            <FormRow>
              <FormGroup>
                <label>Medical Aid Scheme</label>
                <input
                  type="text"
                  name="medicalAidName"
                  value={formData.medicalAidName}
                  onChange={handleInputChange}
                  placeholder="Enter medical aid name (if applicable)"
                />
              </FormGroup>
              <FormGroup>
                <label>Member Number</label>
                <input
                  type="text"
                  name="medicalAidNumber"
                  value={formData.medicalAidNumber}
                  onChange={handleInputChange}
                  placeholder="Enter member number"
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Emergency Contact Section */}
          <FormSection>
            <h3>Emergency Contact</h3>
            <FormRow>
              <FormGroup>
                <label>Emergency Contact Name *</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Enter emergency contact name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Emergency Contact Phone *</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="Enter emergency contact phone"
                  required
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <label>Relationship *</label>
              <select
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleInputChange}
                required
              >
                <option value="">Select relationship</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Spouse">Spouse</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </FormGroup>
          </FormSection>

          {/* Document Upload Section */}
          <FormSection>
            <h3>Document Upload</h3>
            <FileUploadSection>
              <label htmlFor="file-upload" style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                <span style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginRight: 8,
                  color: '#3b82f6',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  letterSpacing: '0.5px'
                }}>
                  {/* Corporate icon or logo can be placed here, e.g. <FiUpload /> if using react-icons */}
                  Upload
                </span>
                Click to upload documents<br />
                <Small>(ID document, medical aid card, etc.)</Small>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              {files.length > 0 && (
                <FileList>
                  {files.map((file, idx) => (
                    <FileItem key={file.name + idx}>
                      {file.name}
                      <RemoveFileBtn type="button" title="Remove file" onClick={() => handleRemoveFile(idx)}>
                        &times;
                      </RemoveFileBtn>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </FileUploadSection>
            <FormRow>
              <FormGroup>
                <label>File Type</label>
                <select
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="ID">ID Document</option>
                  <option value="MedicalAid">Medical Aid Card</option>
                  <option value="Other">Other</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Description (optional)</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description of the uploaded document(s)"
                />
              </FormGroup>
            </FormRow>
          </FormSection>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Submit Patient Filing'}
          </SubmitButton>
        </FilingForm>
      </FilingContent>
    </FilingContainer>
  );
};

export default Filing;