import nodemailer from "nodemailer";

type Payload = {
  to: string;
  subject: string;
  html: string;
};

const smtpSettings = {
  host: process.env.SMTP_SERVER_HOST,
  port: parseInt(process.env.SMTP_SERVER_PORT || '587'),
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
};

export const handleEmailFire = async (data: Payload) => {
  const transporter = nodemailer.createTransport({
    ...smtpSettings,
  });

  return await transporter.sendMail({
    from: `Senegal Vision 2050 <${process.env.SMTP_SERVER_USERNAME}>`,
    ...data,
  });
};