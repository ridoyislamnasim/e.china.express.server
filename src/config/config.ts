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
  // 1688 config
  e1688AppSecret?: string | undefined;
  e1688AccessToken?: string | undefined;
  e1688ApiBaseUrl?: string | undefined;
  e1688UriPath?: string | undefined;
  e1688DefaultOfferId?: string | undefined;
  nodeEnv?: string | undefined;
  isProduction?: boolean | undefined;
}
console.log('Configuring application with environment variables:', {
  port: process.env.PORT,
  host: process.env.HOST,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  databasePassword: process.env.MONGO_PASSWORD,
  jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
  uploadFolder: process.env.UPLOAD_FOLDER,
  uploadPath: process.env.UPLOAD_PATH,
  clientBaseURL: process.env.CLIENT_BASE_URL,
  // 1688 envs for debugging
  E1688_APP_SECRET: process.env.E1688_APP_SECRET,
  E1688_ACCESS_TOKEN: process.env.E1688_ACCESS_TOKEN,
  E1688_API_BASE_URL: process.env.E1688_API_BASE_URL,
  E1688_URI_PATH: process.env.E1688_URI_PATH,
  E1688_DEFAULT_OFFER_ID: process.env.E1688_DEFAULT_OFFER_ID,
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
  // 1688 config
  e1688AppSecret: process.env.E1688_APP_SECRET,
  e1688AccessToken: process.env.E1688_ACCESS_TOKEN,
  e1688ApiBaseUrl: process.env.E1688_API_BASE_URL,
  e1688UriPath: process.env.E1688_URI_PATH,
  e1688DefaultOfferId: process.env.E1688_DEFAULT_OFFER_ID,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
};

export default config;
