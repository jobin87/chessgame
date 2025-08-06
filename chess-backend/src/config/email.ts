import dotnev from "dotenv"
import nodemailer from "nodemailer"

dotnev.config()

export const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})