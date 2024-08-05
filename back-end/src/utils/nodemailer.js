import nodemailer from 'nodemailer';
import logger from './logger.js';
import varenv from '../dotenv.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "donyuyo8@gmail.com",
        pass: varenv.gmail_env
    }
});

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOption = {
        from: "donyuyo8@gmail.com",
        to: email,
        subject: "Cambio de contraseña",
        html: `<p>Haz click aquí para cambiar tu contraseña: <a href='${linkChangePassword}'>Cambiar Contraseña</a></p>`
    };
    try {
        await transporter.sendMail(mailOption);
        logger.info(`Correo de cambio de contraseña enviado a ${email}`);
    } catch (error) {
        logger.error(`Error al enviar correo de cambio de contraseña a ${email}: ${error}`);
    }
};

export const sendEmailNotification = async (email) => {
    const mailOptions = {
        from: 'donyuyo8@gmail.com',
        to: email,
        subject: 'Cuenta Eliminada por Inactividad',
        html: `
            <p>Estimado usuario,</p>
            <p>Su cuenta ha sido eliminada debido a inactividad en los últimos 2 días.</p>
            <p>Si considera que esto es un error o desea obtener más información, póngase en contacto con nuestro soporte.</p>
            <p>Gracias,</p>
            <p>El equipo de soporte</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Notificación de cuenta eliminada enviada a ${email}`);
    } catch (error) {
        logger.error(`Error al enviar notificación de cuenta eliminada a ${email}: ${error}`);
    }
};
