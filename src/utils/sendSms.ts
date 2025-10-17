import config from '../config/config';

interface SmsOptions {
  phoneNumber: string;
  message: string;
  
}

export const sendSMS = async (smsOptions: SmsOptions): Promise<any> => {
  const messageType = 'text';
  const url = `${config.smsUrl}?api_key=${config.smsKey}&type=${messageType}&phone=${smsOptions.phoneNumber}&senderid=${config.smsSenderId}&message=${smsOptions.message}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
    return { error: error.message };
  }
};
