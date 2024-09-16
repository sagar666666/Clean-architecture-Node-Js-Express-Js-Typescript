import { injectable } from "inversify";
import { IMailer } from "../Interfaces/IMailer";
import nodemailer from "nodemailer";
import config from "../../../config.json";
import logger from "../logger/logger";

@injectable()
export class Mailer implements IMailer {
  sendMail(toList: string[], body: string, sub: string) {

    let transporter = nodemailer.createTransport({
      service: config.mailer.service, // Use your email provider
      auth: {
        user: config.mailer.username,
        pass: config.mailer.password,
      }
    });

    let mailOptions = {
      from: config.mailer.from,
      to: toList,
      subject: sub,
      text: body
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(err.message);
      }
      else {
        logger.info(info.response);
      }
    });
  }
}