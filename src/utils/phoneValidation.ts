export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  error?: string;
}

export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
export const INDIAN_PHONE_WITH_CODE_REGEX = /^\+91[6-9]\d{9}$/;

export function validateIndianPhoneNumber(phone: string): PhoneValidationResult {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');

  if (cleaned.startsWith('+91')) {
    const number = cleaned.slice(3);
    if (INDIAN_PHONE_REGEX.test(number)) {
      return {
        isValid: true,
        formatted: `+91${number}`
      };
    }
    return {
      isValid: false,
      error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9.'
    };
  }

  if (cleaned.startsWith('91') && cleaned.length === 12) {
    const number = cleaned.slice(2);
    if (INDIAN_PHONE_REGEX.test(number)) {
      return {
        isValid: true,
        formatted: `+91${number}`
      };
    }
  }

  if (cleaned.length === 10 && INDIAN_PHONE_REGEX.test(cleaned)) {
    return {
      isValid: true,
      formatted: `+91${cleaned}`
    };
  }

  return {
    isValid: false,
    error: 'Invalid phone number format. Enter 10 digits starting with 6-9.'
  };
}

export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const number = cleaned.slice(2);
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
  }

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phone;
}

export function extractPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned.slice(2);
  }

  if (cleaned.length === 10) {
    return cleaned;
  }

  return phone;
}
