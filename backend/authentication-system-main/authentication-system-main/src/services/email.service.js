import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { refreshToken } from '../controllers/auth.controller.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
 type: 'OAUTH2',
 user: config.GOOGLE_USER,
 clientId:config.GOOGLE_CLIENT_ID,
 clientSecret: config.GOOGLE_CLIENT_SECRET,
 refreshToken: config.GOOGLE_REFRESH_TOKEN
    },
})

transporter.verify((error,success)=> {
    if(error){
        console.error('Error connecting to email server',error);
    }else{
        console.log('Email server is ready to send messages');
    }
});
export const sendEmail = async (toString,subject,text,html)=>{
    try{
        const info = await transporter.sendMail({
            from: `"Your Name"<${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent %s',nodemailer.getTestMessageUrl(info));
        console.log(`Preview URL: %s`,nodemailer.getTestMessageUrl(info));

    }catch(error){
        console.error('Error sending email:',error);
    }
};
