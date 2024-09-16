export interface IMailer{
    sendMail(toList:string[], body:string, sub:string);
}