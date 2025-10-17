import otpGenerator from 'otp-generator';

export function orderIdGenerate(title: string, lastOrderId?: string): string {
  const randomAlphabet = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const date = new Date();
  const year = date.toLocaleString('en', { year: '2-digit' });
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  return `${title}${dateString}${randomAlphabet}`;
}
