import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: string | undefined;
  host: string | undefined;
  databaseUrl: string | undefined;
  databasePassword: string | undefined;
  jwtAccessSecretKey: string | undefined;
  jwtRefreshSecretKey: string | undefined;
  uploadFolder: string | undefined;
  uploadPath: string | undefined;
  clientBaseURL: string | undefined;
  smsUrl?: string | undefined;
  smsKey?: string | undefined;
  smsSenderId?: string | undefined;
  smtpService?: string | undefined;
  smtpUser?: string | undefined;
  smtpPass?: string | undefined;
}
console.log('Configuring application with environment variables:', {
  port: process.env.PORT,
  host: process.env.HOST,
  databaseUrl: process.env.DATABASE_URL,
  databasePassword: process.env.MONGO_PASSWORD,
  jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
  uploadFolder: process.env.UPLOAD_FOLDER,
  uploadPath: process.env.UPLOAD_PATH,
  clientBaseURL: process.env.CLIENT_BASE_URL,
});

const config: Config = {
  port: process.env.PORT,
  host: process.env.HOST,
  databaseUrl: process.env.DATABASE_URL,
  databasePassword: process.env.MONGO_PASSWORD,
  jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
  uploadFolder: process.env.UPLOAD_FOLDER,
  uploadPath: process.env.UPLOAD_PATH,
  clientBaseURL: process.env.CLIENT_BASE_URL,
    smtpService: process.env.SMTP_SERVICE || 'gmail',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
};

export default config;
