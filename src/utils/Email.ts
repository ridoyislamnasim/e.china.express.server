import nodemailer from "nodemailer";
import { EmailProps, EmailUser } from "../types/auth/auth.types";

// import { convert } from "html-to-text";

export default class Email implements EmailProps {
  to: string;
  firstName: string;
  OTP: string;
  from: string;

  constructor(user: EmailUser, OTP: string) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(" ")[0] : "Admin";
    this.OTP = OTP;
    this.from = `E China Express <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(
    html: string,
    subject: string,
  ) {
    const mailOptions: any = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: convert(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const html = `
      <h1>Welcome to the E China Express, ${this.firstName}!</h1>
      <p>We are excited to have you onboard.</p>
      <p>Click <a href="${this.OTP}">here</a> to get verified.</p>
    `;
    await this.send(html, `Welcome to the E China Express!`);
  }

  // async sendForgetPasswordOTP() {
  //   const html = `
  //     <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
  //       <h1 style="color: #4CAF50;">Password Forget Request</h1>
  //       <p>Hi ${this.firstName},</p>
  //       <p>We received a request to forget your password. Please click the link below to forget your password:</p>
  //       <p>
  //         <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
  //         ${this.OTP}
  //         </a>
  //       </p>
  //       <p>If you did not request a password forget, please ignore this email.</p>
  //       <p>This link will expire in 5 minutes.</p>
  //       <p><strong>The E China Express</strong></p>
  //     </div>  
  //   `;
  //   await this.send(html, "Your password forget token (valid only for 5 minutes)");
  // }

  async sendForgetPasswordOTP() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Security Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fa; padding: 40px 0;">
  <tr>
    <td align="center">

      <!-- main white card -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:white; border-radius: 8px; overflow:hidden;">

        <!-- header -->
        <tr>
          <td align="center" style="padding: 30px 40px;">
            <h2 style="font-size: 28px; font-weight: 700; margin: 0; color:#0065ff;">
              Are you trying <br /> to log-in from new device?
            </h2>
            <p style="color:#333; font-size:14px; margin: 10px 0 0;">
              <strong>Please confirm your sign-in request</strong>
            </p>
            <p style="color:#6b7280; font-size:13px; margin: 6px 0 0;">
              We have detected an account sign-in request from a device we don’t recognize.
            </p>
          </td>
        </tr>

        <!-- illustration -->
        <tr>
          <td align="center" style="padding: 5px 0 20px;">

            <img src="https://i.ibb.co/5GmK7x7/device-login.png"
              width="310"
              style="display: block; max-width: 90%;"
            />

          </td>
        </tr>

        <!-- device info -->
        <tr>
          <td align="center" style="padding: 0 40px 6px;">
            <p style="margin:0; font-size:14px; font-weight:600; color:#000;">
              Windows · Chrome · USA
            </p>
            <p style="margin:8px 0 0; font-size:12px; color:#6b7280;">
              September 29 at 10:45 AM (PDT)
            </p>
          </td>
        </tr>

        <!-- button -->
        <tr>
          <td align="center" style="padding: 20px 0 30px;">
            <a href="#"
              style="background:#22a6f2; color: white; padding: 12px 36px;
              font-size: 14px; font-weight: 600; border-radius: 4px;
              text-decoration: none; display: inline-block;">
              See More
            </a>
          </td>
        </tr>

      </table>

      <!-- Bottom text -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin-top: 25px;">
        <tr>
          <td align="center">
            <p style="font-size:12px; color:#777; padding: 0 20px;">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p style="font-size:12px; color:#b1b1b1; padding: 0 40px;">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Quis ipsum suspendisse ultrices gravida risus commodo.
            </p>
          </td>
        </tr>
      </table>

      <!-- footer -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
        <tr>
          <td align="center" style="padding: 20px 0 10px;">
            <!-- Social icons -->
            <a href="#"><img src="https://i.ibb.co/7njGWdx/facebook.png" width="20" /></a>&nbsp;&nbsp;
            <a href="#"><img src="https://i.ibb.co/5K9LY2N/twitter.png" width="20" /></a>&nbsp;&nbsp;
            <a href="#"><img src="https://i.ibb.co/Bz9hkz4/linkedin.png" width="20" /></a>&nbsp;&nbsp;
            <a href="#"><img src="https://i.ibb.co/VJ9rTWH/instagram.png" width="20" /></a>
          </td>
        </tr>
        <tr>
          <td align="center">
            <p style="font-size:10px; color:#6b7280; margin: 5px;">
              <a href="#" style="color:#6b7280; text-decoration:none;">UNSUBSCRIBE</a> &nbsp;|&nbsp;
              <a href="#" style="color:#6b7280; text-decoration:none;">PRIVACY POLICY</a> &nbsp;|&nbsp;
              <a href="#" style="color:#6b7280; text-decoration:none;">WEB</a>
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>


  `;


    await this.send(html, "Your OTP — Reset Password (valid for 50 minutes)");
  }


  async sendSignInAlert(
    dynamicTemplateData?: {
      ip: string;
      browser: string;
      os: string;
      date: string;
      time: string;
      geoLocation: string;
    },
    imgArray?: any,
  ) {
    const html = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign-in Alert</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table cellpadding="0" cellspacing="0" width="100%">
          
          <tr>
            <td align="center" style="padding:30px 10px;">
              <table width="550" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
              <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="${imgArray.forgetpassword}" alt="login" style="display: block; max-width: 150px; margin: 0 auto;" />
            </td>
          </tr>
                <tr>
                  <td style="padding:30px 40px;text-align:center;">
                    <h2 style="
                      margin: 0;
                      font-size: 22px;
                      font-weight: 700;
                      color: #ff4a4e;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                      display: inline-block;
                    ">Reset Your Password</h2>
                    <p style="color:#666;margin:5px 0 8px;">Enter this code to reset your password and secure your account</p>

                   <div style="width: 100%; text-align: center; margin: 20px 0;">
  <div style="
      display: inline-flex;
      padding: 2px 62px;
      justify-content: center;
      align-items: center;
      gap: 14px;
      background: linear-gradient(90deg,#ff4a4e 0%,#ff7b00 50%,#ffe600 100%);
      border-radius: 5px;
      box-shadow: 0 10px 25px rgba(255, 107, 107, 0.2);
  ">
    <!-- OTP DIGITS -->
    ${this.OTP.split("").map(num => `
      <div style="
        padding: 8px 12px;
        margin: 7px;
        border-radius: 5px;
        display: flex;
        font-size: 18px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
      ">
        ${num}
      </div>
    `).join("")}
  </div>

  <p style="
    font-size: 16px;
    color: #444;
    margin-top: 5px;
    font-weight: 500;
    padding: 5px 20px;
    line-height: 1.5;
  ">
    Enter this verification code to continue
    <br>
    <span style="color: #888; font-size: 14px; margin-top: 8px; display: block;">
      This code will expire in 5 minutes
    </span>
  </p>
</div>


<div style="max-width: 550px; width: 100%; margin: 20px auto; text-align: center; padding: 0;">
        <h1 style="
            font-size: 16px; 
            font-weight: bold; 
            margin: 0 0 15px;
            padding: 0 15px;
            background: linear-gradient(90deg,#ff4a4e 0%,#ff7b00 50%,#ffe600 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline-block;
        ">
            We noticed you signed in from a new location or device
        </h1>

        <div style="display: flex; min-width: 100%; justify-content: space-between; align-items: stretch; gap: 15px;">
            <div style="
                flex: 1; 
                min-width: 30%;  
                padding: 1%; 
                background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                transition: transform 0.3s ease;
            ">
                <div style="margin-bottom: 15px;">
                    <img src="${imgArray.deviceIcon }" alt="Device" 
                        style="width: 50px; height: 50px; margin: 0 auto 12px; display: block;" 
                        onmouseover="this.style.transform='scale(1.1)'" 
                                onmouseout="this.style.transform='scale(1)'"
                                />
                </div>
                <p style="font-size: 15px; font-weight: 600; color: #222; margin: 0 0 10px;">Device</p>
                <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.5;">${dynamicTemplateData?.browser}</p>
                <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.5;">${dynamicTemplateData?.os}</p>
            </div>

            <div style="
                flex: 1; 
                min-width: 30%;  
                padding: 1%; 
                background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                transition: transform 0.3s ease;
            ">
                <div style="margin-bottom: 15px;">
                    <img src="${imgArray.locationIcon}" alt="Location" 
                        style="width: 50px; height: 50px; margin: 0 auto 12px; display: block;" />
                </div>
                <p style="font-size: 13px; font-weight: 600; color: #222; margin: 0 0 10px;">Location</p>
                <p style="font-size: 13px; color: #222; margin: 0; line-height: 1.5;">${dynamicTemplateData?.geoLocation}</p>
                <p style="font-size: 13px; color: #222; margin: 0; line-height: 1.5;">${dynamicTemplateData?.ip}</p>
            </div>

            <div style="
                flex: 1; 
                min-width: 30%; 
                padding: 1%; 
                background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                transition: transform 0.3s ease;
            ">
                <div style="margin-bottom: 15px;">
                    <img src="${imgArray.dateIcon}" alt="Calendar" 
                        style="width: 50px; height: 50px; margin: 0 auto 12px; display: block;" />
                </div>
                <p style="font-size: 15px; font-weight: 600; color: #222; margin: 0 0 10px;">Date</p>
                <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.5;">${dynamicTemplateData?.date}</p>
                <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.5;">${dynamicTemplateData?.time}</p>
            </div>
        </div>
    </div>


                    
</td>
                </tr>

                <tr>
                  <td align="center" style="background:#0f1720;padding:30px 0;color:#fff;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <p style="margin:0 0 15px;font-size:12px;color:#9aa7b4;">Connect with us:</p>
                          <div style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 20px;
                            flex-wrap: wrap;
                            margin: 0 auto;
                            padding: 5px;
                            width: auto;
                            min-width: 200px;
                            max-width: 300px;
                            ">
                            <a href="https://facebook.com/e-china-express" target="_blank" 
                              style="text-decoration: none; transition: transform 0.3s ease; margin 0px 15px">
                              <img src="${imgArray.facebook}" alt="Facebook" 
                                style="max-width: 25px; margin: 0; padding: 0px 15px;" 
                                onmouseover="this.style.transform='scale(1.1)'" 
                                onmouseout="this.style.transform='scale(1)'" />
                            </a>
                            <a href="https://instagram.com/e-china-express" target="_blank" 
                              style="text-decoration: none; transition: transform 0.3s ease; margin 0px 15px">
                              <img src="${imgArray.instagram}" alt="Instagram" 
                                style="max-width: 25px; margin: 0; padding: 0px 15px;" 
                                onmouseover="this.style.transform='scale(1.1)'" 
                                onmouseout="this.style.transform='scale(1)'" />
                            </a>
                            <a href="https://linkedin.com/company/e-china-express" target="_blank" 
                              style="text-decoration: none; transition: transform 0.3s ease; margin 0px 15px ">
                              <img src="${imgArray.linkedin}" alt="LinkedIn" 
                                style="max-width: 25px; margin: 0; padding: 0px 15px;" 
                                onmouseover="this.style.transform='scale(1.1)'" 
                                onmouseout="this.style.transform='scale(1)'" />
                            </a>
                            <a href="https://t.me/e_china_express" target="_blank" 
                              style="text-decoration: none; transition: transform 0.3s ease; margin 0px 15px">
                              <img src="${imgArray.telegram}" alt="Telegram" 
                                style="max-width: 25px; margin: 0; padding: 0px 15px;" 
                                onmouseover="this.style.transform='scale(1.1)'" 
                                onmouseout="this.style.transform='scale(1)'" />
                            </a>
                            <a href="https://wa.me/+8801XXXXXXXXX" target="_blank" 
                              style="text-decoration: none; transition: transform 0.3s ease; margin 0px 15px">
                              <img src="${imgArray.whatsapp}" alt="WhatsApp" 
                                style="max-width: 25px; margin: 0; padding: 0px 15px;" 
                                onmouseover="this.style.transform='scale(1.1)'" 
                                onmouseout="this.style.transform='scale(1)'" />
                            </a>
                          </div>
                    <div align="center" style="text-align: center; font-family: Arial, sans-serif; color: #888; font-size: 13px;">

      <a href="#" 
        style="color:#888; text-decoration:none; margin: 0 8px; transition: all 0.3s ease;"
        onmouseover="this.style.background='linear-gradient(90deg,#ff4a4e 0%,#ff7b00 50%,#ffe600 100%)'; this.style.webkitBackgroundClip='text'; this.style.webkitTextFillColor='transparent'; this.style.backgroundClip='text'"
        onmouseout="this.style.background='none'; this.style.webkitTextFillColor='#888'; this.style.color='#888'">
        SUBSCRIBE
      </a>

      <span style="color:#ccc;">|</span>

      <a href="#" 
        style="color:#888; text-decoration:none; margin: 0 8px; transition: all 0.3s ease;"
        onmouseover="this.style.background='linear-gradient(90deg,#ff4a4e 0%,#ff7b00 50%,#ffe600 100%)'; this.style.webkitBackgroundClip='text'; this.style.webkitTextFillColor='transparent'; this.style.backgroundClip='text'"
        onmouseout="this.style.background='none'; this.style.webkitTextFillColor='#888'; this.style.color='#888'">
        PRIVACY POLICY
      </a>

      <span style="color:#ccc;">|</span>

      <a href="#" 
        style="color:#888; text-decoration:none; margin: 0 8px; transition: all 0.3s ease;"
        onmouseover="this.style.background='linear-gradient(90deg,#ff4a4e 0%,#ff7b00 50%,#ffe600 100%)'; this.style.webkitBackgroundClip='text'; this.style.webkitTextFillColor='transparent'; this.style.backgroundClip='text'"
        onmouseout="this.style.background='none'; this.style.webkitTextFillColor='#888'; this.style.color='#888'">
        WEB
      </a>

    </div>
                    <p style="margin:0;font-size:12px;color:#9aa7b4; margin-top: 5px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#9aa7b4;">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await this.send(html, 'New sign-in request detected');
  }


}
