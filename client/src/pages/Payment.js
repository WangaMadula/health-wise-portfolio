import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import paymentConfig from '../config/payments';
import { formatCurrency } from '../utils/api';
import { FiCopy, FiCheckCircle, FiInfo, FiCreditCard, FiShield } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1280px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.secondary.lightGray};
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  
  /* Ensure consistent internal spacing */
  & > *:last-child { 
    margin-bottom: 0; 
  }
`;

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: clamp(20px, 3vw, 36px);
  row-gap: 28px;
  margin-top: 0;
  align-items: stretch;
  
  /* Ensure all cards stretch to same height */
  & > * {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  color: ${theme.colors.primary.darkBlue};
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
  font-weight: 700;
`;

const SectionHeading = styled.h2`
  margin: 0 auto 1.25rem;
  color: ${theme.colors.primary.darkBlue};
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  max-width: 1280px;
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.85rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 0.6rem;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary.skyBlue};
    background: #f1f5f9;
    box-shadow: ${theme.shadows.sm};
  }
`;

const Label = styled.span`
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
`;

const ValueRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-left: 10px;
  border-left: 1px solid #e2e8f0;
`;

const Code = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #0f172a;
  letter-spacing: 0.02em;
  font-size: 0.95rem;
`;

const CopyBtn = styled.button`
  background: ${theme.colors.primary.lightBlue};
  color: white;
  border: none;
  padding: 0.45rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    filter: brightness(1.05);
    box-shadow: ${theme.shadows.sm};
  }
`;

const Note = styled.div`
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 10px;
  border-left: 4px solid ${theme.colors.purple.medium};
  color: #0f172a;
  flex-grow: 1;
  
  p {
    margin: 0 0 0.4rem 0;
    line-height: 1.5;
    font-size: 0.9rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    margin: 0.4rem 0 0 1rem;
    line-height: 1.5;
    padding-left: 0;
    font-size: 0.9rem;
    
    li {
      margin-bottom: 0.2rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 0.75rem;
`;

const OutlineBtn = styled.button`
  background: transparent;
  color: ${theme.colors.primary.mediumBlue};
  border: 2px solid ${theme.colors.primary.mediumBlue};
  padding: 0.4rem 0.65rem;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-size: 0.85rem;

  &:hover {
    background: ${theme.colors.primary.paleBlue};
    box-shadow: ${theme.shadows.sm};
  }
`;

const FeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
  margin-top: 0.4rem;
`;

const FeeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  aspect-ratio: 1 / 1;
  width: 100%;
  min-width: 0;
  text-align: center;
  overflow: hidden;
  padding: 0.4rem;

  span:first-child {
    color: #475569;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.2;
    max-width: 90%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span:last-child {
    color: #0f172a;
    font-weight: 800;
    font-size: 0.85rem;
    white-space: nowrap;
  }
`;

const TextBtn = styled.button`
  background: transparent;
  color: ${theme.colors.primary.mediumBlue};
  border: none;
  padding: 0;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover { color: ${theme.colors.primary.darkBlue}; }
`;

const BadgeRow = styled.div`
  display: inline-flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: ${theme.colors.primary.darkBlue};
  background: rgba(255, 255, 255, 0.25);
  border: 1.5px solid ${theme.colors.primary.skyBlue};
  box-shadow: 0 4px 12px rgba(99, 179, 237, 0.35), 0 0 0 3px rgba(99, 179, 237, 0.15);
  backdrop-filter: saturate(140%) blur(6px);
  -webkit-backdrop-filter: saturate(140%) blur(6px);
  white-space: nowrap;
  flex: 0 0 auto;

  svg {
    color: ${theme.colors.primary.mediumBlue};
  }
`;

const CopiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.status.success};
  font-size: 12px;
  font-weight: 700;
`;

const Payment = () => {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [copied, setCopied] = useState('');
  const [reference, setReference] = useState('');
  const [showFees, setShowFees] = useState(false);
  const [showSchemes, setShowSchemes] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setParallaxOffset(-(y * 0.25));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 1500);
    } catch (e) {}
  };

  const copyAll = () => {
    const content = `Banking Details\n\nCompany: ${paymentConfig.companyName}\nBank: ${paymentConfig.bankName}\nAccount Name: ${paymentConfig.accountName}\nAccount Number: ${paymentConfig.accountNumber}\nBranch Code: ${paymentConfig.branchCode}\nAccount Type: ${paymentConfig.accountType}${paymentConfig.swiftCode ? `\nSWIFT: ${paymentConfig.swiftCode}` : ''}\n\nReference: ${reference || 'Your South African ID number'}`;
    copy(content, 'all');
  };

  const heroBackground = {
    backgroundImage: 'url("/Doctor-with-mum-and-daughter-1-2.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: `center calc(20% + ${parallaxOffset}px)`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };

  return (
    <>
      <section
        style={Object.assign(
          {
            padding: '120px 0',
            textAlign: 'center',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            marginTop: `-${theme.sizes.header}`,
            paddingTop: `calc(120px + ${theme.sizes.header})`,
            color: 'white'
          },
          heroBackground
        )}
      >
        <div className="container">
          <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 12px', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>Payments</h1>
          <p style={{ fontSize: '18px', margin: 0, textShadow: '1px 1px 6px rgba(0,0,0,0.6)' }}>
            Pay securely via EFT/bank transfer. Please use your South African ID as the payment reference to ensure prompt allocation.
          </p>
        </div>
      </section>

      <Container>
  <SectionHeading>Billing Details</SectionHeading>
      <TwoCol>
        {/* Banking Details Card */}
        <Card>
          <SectionTitle><FiCreditCard /> Banking Details</SectionTitle>
          <CardContent>
            <div>
              <Field onClick={() => copy(paymentConfig.companyName, 'company')}>
                <Label>Company Name</Label>
                <ValueRow>
                  <Code>{paymentConfig.companyName}</Code>
                  {copied==='company' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                </ValueRow>
              </Field>
              <Field onClick={() => copy(paymentConfig.bankName, 'bank')}>
                <Label>Bank</Label>
                <ValueRow>
                  <Code>{paymentConfig.bankName}</Code>
                  {copied==='bank' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                </ValueRow>
              </Field>
              <Field onClick={() => copy(paymentConfig.accountName, 'accountName')}>
                <Label>Account Name</Label>
                <ValueRow>
                  <Code>{paymentConfig.accountName}</Code>
                  {copied==='accountName' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                </ValueRow>
              </Field>
              <Field onClick={() => copy(paymentConfig.accountNumber, 'account')}>
                <Label>Account Number</Label>
                <ValueRow>
                  <Code>{paymentConfig.accountNumber}</Code>
                  {copied==='account' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                  <CopyBtn aria-label="Copy account number" onClick={(e) => { e.stopPropagation(); copy(paymentConfig.accountNumber, 'account'); }}>
                    {copied==='account' ? <FiCheckCircle /> : <FiCopy />} {copied==='account' ? 'Copied' : 'Copy'}
                  </CopyBtn>
                </ValueRow>
              </Field>
              <Field onClick={() => copy(paymentConfig.branchCode, 'branch')}>
                <Label>Branch Code</Label>
                <ValueRow>
                  <Code>{paymentConfig.branchCode}</Code>
                  {copied==='branch' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                  <CopyBtn aria-label="Copy branch code" onClick={(e) => { e.stopPropagation(); copy(paymentConfig.branchCode, 'branch'); }}>
                    {copied==='branch' ? <FiCheckCircle /> : <FiCopy />} {copied==='branch' ? 'Copied' : 'Copy'}
                  </CopyBtn>
                </ValueRow>
              </Field>
              <Field onClick={() => copy(paymentConfig.accountType, 'accountType')}>
                <Label>Account Type</Label>
                <ValueRow>
                  <Code>{paymentConfig.accountType}</Code>
                  {copied==='accountType' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                </ValueRow>
              </Field>
              {paymentConfig.swiftCode && (
                <Field onClick={() => copy(paymentConfig.swiftCode, 'swift')}>
                  <Label>SWIFT</Label>
                  <ValueRow>
                    <Code>{paymentConfig.swiftCode}</Code>
                    {copied==='swift' && <CopiedBadge><FiCheckCircle /> Copied</CopiedBadge>}
                  </ValueRow>
                </Field>
              )}
            </div>
            <Actions>
              <CopyBtn aria-label="Copy all banking details" onClick={copyAll}>
                {copied==='all' ? <FiCheckCircle /> : <FiCopy />} {copied==='all' ? 'Copied' : 'Copy all details'}
              </CopyBtn>
              <OutlineBtn onClick={() => window.print()}><FiInfo /> Print for records</OutlineBtn>
            </Actions>
          </CardContent>
        </Card>

        {/* Payment Instructions Card */}
        <Card>
          <SectionTitle><FiInfo /> Payment Instructions</SectionTitle>
          <CardContent>
            <Note>
              <p style={{ marginTop: 0, marginBottom: '4px', fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                You may pay your deposit as soon as your appointment has been confirmed.
              </p>
              <p style={{ marginTop: 0, marginBottom: '4px', fontSize: '0.85rem' }}>Please include your South African ID number as the payment reference so we can match your payment to your account quickly.</p>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
                <input
                  type="text"
                  placeholder="Enter your SA ID number (optional)"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
                <CopyBtn aria-label="Copy reference" onClick={() => copy(reference || 'Your South African ID number', 'ref')}>
                  {copied==='ref' ? <FiCheckCircle /> : <FiCopy />}
                </CopyBtn>
              </div>
              <ul style={{ margin: '0.4rem 0 0 1rem', lineHeight: 1.4, fontSize: '0.8rem' }}>
                <li>Reference example: 8801011234087</li>
                <li>If you don't have an SA ID, use your passport number</li>
                <li>Send proof of payment to {paymentConfig.supportEmail}</li>
                <li>Include your name and appointment date in the payment description</li>
                <li>Payments are typically processed within 24-48 hours</li>
                <li>Keep your payment receipt for your records</li>
              </ul>
            </Note>

            <div>
              <p style={{ margin: '0 0 0.3rem 0', color: '#475569', fontSize: '0.8rem' }}>Typical fees (guide):</p>
              <FeeGrid>
                <FeeItem>
                  <span>General Consultation</span>
                  <span>{formatCurrency(1250)}</span>
                </FeeItem>
                <FeeItem>
                  <span>Specialist Consultation</span>
                  <span>{formatCurrency(1450)}</span>
                </FeeItem>
                <FeeItem>
                  <span>Medical Check-up</span>
                  <span>{formatCurrency(1350)}</span>
                </FeeItem>
              </FeeGrid>
            </div>
          </CardContent>
        </Card>

        {/* Medical Aid Card */}
        <Card>
          <SectionTitle><FiShield /> Medical Aid Payments</SectionTitle>
          <CardContent>
            <Note>
              <p style={{ marginTop: 0, marginBottom: '4px', fontSize: '0.85rem' }}>
                We can assist with claims to your medical aid. Depending on your plan and benefits, a co-payment may apply at the time of service.
              </p>
              <ul style={{ margin: '0.4rem 0 0 1rem', lineHeight: 1.4, fontSize: '0.8rem' }}>
                <li>Please bring your Medical Aid card and ID document on the day.</li>
                <li>Pre-authorization may be required for certain procedures.</li>
                <li>Outstanding balances remain the patient's responsibility.</li>
              </ul>
            </Note>

            <div>
              <p style={{ margin: '0 0 0.3rem 0', color: '#475569', fontWeight: 600, fontSize: '0.8rem' }}>Information we need:</p>
            <FeeGrid>
              <FeeItem>
                <span>Medical Aid Scheme</span>
                <span>Required</span>
              </FeeItem>
              <FeeItem>
                <span>Member Number</span>
                <span>Required</span>
              </FeeItem>
              <FeeItem>
                <span>Main Member ID</span>
                <span>If Dependent</span>
              </FeeItem>
              <FeeItem>
                <span>Dependent Code</span>
                <span>If Applicable</span>
              </FeeItem>
              <FeeItem>
                <span>Pre-Auth No.</span>
                <span>If Required</span>
              </FeeItem>
              </FeeGrid>
            </div>

            <div>
              <TextBtn onClick={() => setShowSchemes(v => !v)} aria-expanded={showSchemes} aria-controls="schemes-list">
              {showSchemes ? 'Hide accepted schemes' : 'View accepted schemes'}
            </TextBtn>
            {showSchemes && (
              <div id="schemes-list" style={{ marginTop: '0.4rem', color: '#475569', fontSize: '0.8rem' }}>
                <ul style={{ margin: 0, paddingLeft: '1rem', columns: 2, columnGap: '1.5rem' }}>
                  <li>Discovery</li>
                  <li>Momentum</li>
                  <li>Bonitas</li>
                  <li>Fedhealth</li>
                  <li>Medshield</li>
                  <li>GEMS</li>
                </ul>
              </div>
            )}
          </div>

          <Actions>
            <OutlineBtn onClick={() => (window.location.href = '/filing')}><FiInfo /> Submit details via Filing</OutlineBtn>
            <OutlineBtn onClick={() => (window.location.href = `mailto:${paymentConfig.supportEmail}?subject=Medical%20Aid%20Details&body=Please%20include%20your%20Medical%20Aid%20scheme%2C%20member%20number%2C%20and%20ID.`)}>
              <FiInfo /> Email billing
            </OutlineBtn>
            </Actions>
          </CardContent>
        </Card>
      </TwoCol>
    </Container>

      {/* Refund reassurance message at the bottom */}
      <div style={{
        background: '#e0f7fa',
        color: '#00695c',
        borderRadius: '10px',
        padding: '18px 24px',
        margin: '32px auto 64px',
        maxWidth: 800,
        fontWeight: 600,
        fontSize: '1.08rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        textAlign: 'center',
        border: '1.5px solid #4dd0e1'
      }}>
        If you need to cancel your appointment, you will receive a full refund. Your peace of mind is important to us.
      </div>
    </>
  );
};

export default Payment;
