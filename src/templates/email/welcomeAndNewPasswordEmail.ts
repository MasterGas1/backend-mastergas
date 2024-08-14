export const welcomeAndNewPasswordEmail = (name: string, lastName: string, email: string, token: string) => {
    return `
        <html>
            <head>
                <style>
                .content {
                    text-align: center;
                    background-color: #fff;
                    padding: 20px;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    border-collapse: collapse;
                }
                .header {
                    color: #2E5043;
                }
                .body {
                    color: #555;
                    width: 100%;
                }
                img {
                width: 180px;
                height: 180px;
                }
                </style>
            </head>

            <body>
                <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" valign="top">
                    <table class="content" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td align="center">
                            <img src="https://res.cloudinary.com/dnesdnfxy/image/upload/v1718837803/mastergas23/zo0sobwnt573iig40nve.png"/>
                            <h1 class="header">Bienvenido a Mastergas23</h1>
                            <p class="body">Hola ${name} ${lastName},</p>
                            <p class="body">Su solicitud ha sido aceptada.</p>
                            <p class="body">Su correo electronico es: ${email} para iniciar sesion</p>
                            <p class="body">Para iniciar sesion necesita ingresar una nueva contrasena.</p>
                            <a href="${process.env.URL_CHANGE_PASSWORD}/${token}" style="text-decoration: none; background-color: #2E5043; color: #fff; padding: 10px; border-radius: 10px; margin-top: 10px; font-weight: bold; margin-bottom: 10px; line-height: 40px;">Cambiar contraseña</a>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </body>
        </html>
    `
}