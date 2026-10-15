// Utility for phone validation and country code list
export const countryCodes = [
  { code: '+1', name: 'USA/Canada' },
  { code: '+44', name: 'UK' },
  { code: '+27', name: 'South Africa' },
  { code: '+91', name: 'India' },
  { code: '+61', name: 'Australia' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+234', name: 'Nigeria' },
  { code: '+81', name: 'Japan' },
  { code: '+86', name: 'China' },
  // ...add more as needed
];

export function validatePhoneNumber(number, countryCode) {
  // Remove spaces, dashes, parentheses
  const cleaned = number.replace(/[\s\-()]/g, '');
  // Basic: must be digits only, 7-15 digits (E.164)
  if (!/^\d{7,15}$/.test(cleaned)) return false;
  // Optionally, add country-specific rules here
  return true;
}
