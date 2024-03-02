import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import ejs from "ejs";

interface EmailOptions {
  email: string;
  subject?: string;
  // body?: string | HTMLElement,
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: parseInt(process.env.SMTP_PORT || '587'),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
  const templatePath = path.join(__dirname, "../mails", template);
  const html: string = await ejs.renderFile(templatePath, data);
  //sending mail
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject || "No Subject",
    html: html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // do something useful
    }
  });
};

export default sendMail;
