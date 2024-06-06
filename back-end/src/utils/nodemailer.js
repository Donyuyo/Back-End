import nodemailer from 'nodemailer';
import logger from './logger.js';
import varenv from '../dotenv.js';


const transporter = nodemailer.createTransport ({
    service : 'gmail',
    auth: {
        user: "donyuyo8@gmail.com",
        pass: varenv.gmail_env
    }

})

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOption = {
        from: "donyuyo8@gmail.com",
        to: email,
        subject: "Cambio de contraseña",
        html:
        `
        <p> Haz click aqui para cambiar tu contraseña. </p> <button> <a href=${linkChangePassword}> Cambiar contraseña </a> </button>
        
        `,
        
    }
    transporter.sendMail(mailOption, (error,info) =>{
        if(error){
            console.log("Error al enviar correo de cambio de contraseña")
        }else{
            console.log("correo enviado correctamente", info.response)
        }
    })
}