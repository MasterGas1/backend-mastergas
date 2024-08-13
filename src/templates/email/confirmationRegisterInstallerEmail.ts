export const confirmationRegisterInstallerEmail = (name: string, lastName: string) => {
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
          height: 180px
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
                        <p class="body">Muchas gracias por registrarte, uno de nuestros administradores se pondra en contacto contigo para el seguimiento de tu registro</p>
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