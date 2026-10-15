import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Logo from '../components/Logo';
import { theme } from '../styles/theme';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  margin-top: -80px;
  padding-top: 80px;
  padding-bottom: 150px; /* Add space for footer */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  background-image: url('/Doctor-with-mum-and-daughter-1-2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
`;

const InteractiveGlow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    600px 400px at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%),
    rgba(59, 130, 246, 0.15),
    transparent 60%
  );
  transition: opacity 0.3s ease;
`;

const LoginBox = styled.div`
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: ${theme.sizes.borderRadiusLarge};
  padding: 40px;
  box-shadow: ${theme.shadows.xl}, 0 0 0 1px rgba(65, 138, 227, 0.3);
  border: 2px solid rgba(65, 138, 227, 0.4);
  width: 100%;
  max-width: 450px;

  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 35px;
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

const Title = styled.h2`
  color: ${theme.colors.primary.darkBlue};
  font-size: 28px;
  font-weight: 700;
  margin: 15px 0 5px;
`;

const Subtitle = styled.p`
  color: white;
  font-size: 17px;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${theme.colors.primary.darkBlue};
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  margin-right: 8px;
  color: ${theme.colors.primary.lightBlue};
  display: inline-flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: ${theme.sizes.borderRadius};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.lightBlue};
    box-shadow: 0 0 0 3px ${theme.colors.primary.paleBlue};
  }

  &::placeholder {
    color: #aaa;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordInput = styled(Input)`
  padding-right: 45px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.secondary.gray};
  cursor: pointer;
  fontSize: 16px;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: ${theme.colors.primary.lightBlue};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  background: linear-gradient(135deg, ${theme.colors.primary.darkBlue} 0%, ${theme.colors.primary.lightBlue} 100%);
  color: white;
  border: none;
  border-radius: ${theme.sizes.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 30px;

  p {
    color: white;
    font-size: 15px;
    margin: 0 0 10px 0;
    font-weight: 600;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
  }
`;

const StyledLink = styled(Link)`
  color: #66b3ff;
  text-decoration: none;
  font-weight: 700;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);

  &:hover {
    color: #99ccff;
    text-decoration: underline;
  }
`;

const DemoAccounts = styled.div`
  margin-top: 25px;
  padding: 15px;
  background: ${theme.colors.primary.paleBlue};
  border-radius: ${theme.sizes.borderRadius};
  text-align: left;
`;

const DemoTitle = styled.h4`
  color: ${theme.colors.primary.darkBlue};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const DemoText = styled.p`
  font-size: 12px;
  color: ${theme.colors.secondary.gray};
  line-height: 1.5;
  margin: 0;

  strong {
    color: ${theme.colors.primary.darkBlue};
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0.5, y: 0.5 });
  
  const { login, isAuthenticated, user, resetPassword } = useAuth();
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if authenticated and user loaded
  useEffect(() => {
    const checkAdminAndRedirect = async () => {
      if (isAuthenticated && user) {
        // Check if user is admin
        try {
          const adminsCol = collection(db, 'admins');
          const q = query(adminsCol, where('email', '==', user.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            navigate('/admin/bookings');
            return;
          }
        } catch (err) {
          // fallback to client portal
        }
        navigate('/');
      }
    };
    checkAdminAndRedirect();
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGlowPos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  const handleMouseLeave = () => {
    setGlowPos({ x: 0.5, y: 0.5 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful!');
        // Navigation is handled by useEffect above
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--mx': glowPos.x, '--my': glowPos.y }}
    >
      <InteractiveGlow />
      <LoginBox>
        <Header>
          <LogoWrapper>
            <LogoAvatar>
              <LogoImage src="/logo3.png" alt="Healthwise Clinic" />
            </LogoAvatar>
          </LogoWrapper>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your Healthwise account</Subtitle>
        </Header>

        {!showReset ? (
          <>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <Icon><FaEnvelope /></Icon>
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <Icon><FaLock /></Icon>
                  Password
                </Label>
                <PasswordContainer>
                  <PasswordInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                </PasswordContainer>
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </SubmitButton>
            </Form>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <StyledLink as="button" type="button" style={{ background: 'none', border: 'none', color: '#66b3ff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }} onClick={() => setShowReset(true)}>
                Forgot password?
              </StyledLink>
            </div>
          </>
        ) : (
          <>
            <Form onSubmit={async (e) => {
              e.preventDefault();
              setResetLoading(true);
              const result = await resetPassword(resetEmail);
              if (result.success) {
                toast.success('Password reset email sent!');
                setShowReset(false);
              } else {
                toast.error(result.error || 'Failed to send reset email');
              }
              setResetLoading(false);
            }}>
              <FormGroup>
                <Label>
                  <Icon><FaEnvelope /></Icon>
                  Enter your email to reset password
                </Label>
                <Input
                  type="email"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </FormGroup>
              <SubmitButton type="submit" disabled={resetLoading}>
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </SubmitButton>
            </Form>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <StyledLink as="button" type="button" style={{ background: 'none', border: 'none', color: '#66b3ff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }} onClick={() => setShowReset(false)}>
                Back to login
              </StyledLink>
            </div>
          </>
        )}

        <Footer>
          <p>
            Don't have an account?{' '}
            <StyledLink to="/register">
              Sign up here
            </StyledLink>
          </p>
        </Footer>
      </LoginBox>
    </PageContainer>
  );
};

export default Login;