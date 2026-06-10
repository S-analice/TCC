import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const enviarEmailRecuperacao = async (email, nome, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f5f5f5;
                }
                .container { 
                    max-width: 560px; 
                    margin: 40px auto; 
                    background: #ffffff; 
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .header { 
                    background: #436850; 
                    padding: 32px 24px 24px 24px;
                    text-align: center;
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 500;
                    letter-spacing: 1px;
                    color: #ffffff;
                }
                .header .subtitle { 
                    margin: 8px 0 0 0;
                    font-size: 12px; 
                    font-weight: 300;
                    letter-spacing: 0.5px;
                    color: rgba(255,255,255,0.7);
                }
                .content { 
                    padding: 32px 32px 40px 32px; 
                    background: #ffffff;
                }
                .greeting {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 24px;
                }
                .greeting strong {
                    color: #436850;
                }
                .message {
                    color: #555555;
                    line-height: 1.6;
                    margin-bottom: 28px;
                }
                .warning {
                    font-size: 12px;
                    color: #888888;
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #eaeaea;
                }
                .warning p {
                    margin: 4px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>GEPARK</h1>
                    <div class="subtitle">Sistema para Gerenciamento de Estacionamento de Veículos Pesados</div>
                </div>
                <div class="content">
                    <div class="greeting">
                        Olá, <strong>${nome}</strong>
                    </div>
                    <div class="message">
                        Recebemos uma solicitação para redefinir a senha da sua conta.
                    </div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 24px 0;">
                        <tr>
                            <td align="center">
                                <table cellpadding="0" cellspacing="0" border="0" style="background-color: #436850; border-radius: 4px;">
                                    <tr>
                                        <td style="background-color: #436850; border-radius: 4px;">
                                            <a href="${resetLink}" style="background-color: #436850; color: #ffffff; text-decoration: none; display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 500; border-radius: 4px;">Redefinir Senha</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    <div class="warning">
                        <p>Se você não solicitou, ignore este e-mail.</p>
                        <p>Este link é válido por 1 hora.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    await transporter.sendMail({
        from: `"GEPARK" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Redefinição de Senha',
        html,
    });
};