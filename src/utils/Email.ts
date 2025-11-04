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
    device: string,
    browser: string,
    location: string,
    time: string,
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
      <img src="${imgArray.forgetpassword}" alt="login" style="display:none;" />

        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding:30px 10px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="padding:30px 40px;text-align:center;">
                    <h2 style="margin:0;color:#1e73be;font-size:22px;">Are you trying to log-in from new device?</h2>
                    <p style="color:#666;margin:12px 0 24px;">Please confirm your sign-in request</p>

                    <div style="width:100%;display:flex;justify-content:center;align-items:center;">
                      <div style="width:260px;height:160px;background:#eaf3ff;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                       nasim  <img src="cid:fbImage" alt="login" style="max-width:120px;margin-bottom:12px;" />
                      </div>
                    </div>

                    <p style="color:#444;font-size:15px;margin:22px 0 6px;">We have detected an account sign-in request from a device we don't recognize.</p>
                    <p style="color:#777;font-size:13px;margin:0 0 22px;">If this was you, no action is needed. If not, please secure your account.</p>

                    <table cellpadding="0" cellspacing="0" style="margin:12px auto 22px;">
                      <tr>
                        <td style="padding:8px 14px;background:#f1f7fb;border-radius:6px;color:#333;font-size:13px;margin-right:8px;">${device} · ${browser}</td>
                        <td style="padding:8px 14px;background:#f1f7fb;border-radius:6px;color:#333;font-size:13px;margin-left:8px;">${location}</td>
                      </tr>
                    </table>

                    <p style="color:#999;font-size:12px;margin:0 0 20px;">${location} ${time}</p>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin: 20px 0;">
                      <img src="${imgArray.facebook}" alt="Facebook" style="max-width: 80px;" />
                      <img src="${imgArray.nagad}" alt="Nagad" style="max-width: 80px;" />
                      <img src="${imgArray.instagram}" alt="Instagram" style="max-width: 80px;" />
                      <img src="${imgArray.linkdin}" alt="Linkdin" style="max-width: 80px;" />
                      <img src="${imgArray.threads}" alt="Threads" style="max-width: 80px;" />
                    </div>

                    <a href="#" style="display:inline-block;padding:12px 22px;background:#1e73be;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">See More</a>
                  </td>
                </tr>

                <tr>
                  <td style="background:#0f1720;padding:18px 40px;color:#fff;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#9aa7b4;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
