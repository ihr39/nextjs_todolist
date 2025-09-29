import nodemailer from 'nodemailer'

interface EmailData {
    from: string,
    subject: string,
    message: string,
}

const transport = nodemailer.createTransport({
    host: 'smtp.worksmobile.com',
    port: 465,
    secure: true,
    auth:{
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD
    },
})

export async function sendEmail({from, subject, message}: EmailData){
    const mailData={
        to: from, //--받는 사람 이메일
        subject: subject,
        from: process.env.MAIL_ID, 
        html: `
            <h1>${subject}</h1>
            <div>${message}</div>
        `
    }
    return transport.sendMail(mailData)
}