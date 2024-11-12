import { Mailer } from '../../../src/Infrastructure/MailerService/Mailer';
import nodemailer from 'nodemailer'; // We will mock nodemailer
import logger from '../../../src/Infrastructure/logger/logger';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

jest.mock('../../../src/Infrastructure/logger/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('Mailer', () => {
  let mailer: Mailer;
  let mockSendMail: jest.Mock;
  let mockTransporter: any;

  beforeEach(() => {
    mailer = new Mailer();
    mockTransporter = nodemailer.createTransport();
    mockSendMail = mockTransporter.sendMail;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    it('should send an email successfully and log the response', async () => {
      const toList = ['mohitesagar12@gmail.com'];
      const body = 'This is a test email body';
      const sub = 'Test Email Subject';
      mockSendMail.mockImplementationOnce((mailOptions, callback) => {
        callback(null, { response: 'Message sent successfully!' });
      });
      
      await mailer.sendMail(toList, body, sub);
      expect(mockSendMail).toHaveBeenCalledWith(
        {
          from: expect.any(String),
          to: toList,
          subject: sub,
          text: body,
        },
        expect.any(Function)
      );
      expect(logger.info).toHaveBeenCalledWith('Message sent successfully!');
    });

    it('should log an error when email sending fails', async () => {
      const toList = ['mohitesagar12@gmail.com'];
      const body = 'This is a test email body';
      const sub = 'Test Email Subject';
      mockSendMail.mockImplementationOnce((mailOptions, callback) => {
        callback(new Error('Failed to send email'), null);
      });
      await mailer.sendMail(toList, body, sub);
      expect(mockSendMail).toHaveBeenCalledWith(
        {
          from: expect.any(String),
          to: toList,
          subject: sub,
          text: body,
        },
        expect.any(Function)
      );
      expect(logger.error).toHaveBeenCalledWith('Failed to send email');
    });
  });
});
