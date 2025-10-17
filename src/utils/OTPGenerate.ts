import otpGenerator from 'otp-generator';

export function OTPGenerate(): string {
  return otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
}
