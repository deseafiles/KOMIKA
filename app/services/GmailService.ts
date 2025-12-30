import env from '#start/env'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
console.log('NODE_ENV =', env.get('NODE_ENV'))
console.log('GOOGLE_EMAIL =', env.get('MAIL_FROM_ADDRESS'))
console.log('REDIRECT_URI =', env.get('GOOGLE_REDIRECT_URI'))
console.log('GOOGLE_CLIENT_ID =', env.get('GOOGLE_CLIENT_ID'))
console.log('GOOGLE_CLIENT_SECRET =', env.get('GOOGLE_CLIENT_SECRET'))
console.log('REDIRECT_URI =', env.get('GOOGLE_REFRESH_TOKEN'))

const oAuth2Client = new google.auth.OAuth2(
  env.get('GOOGLE_CLIENT_ID'),
  env.get('GOOGLE_CLIENT_SECRET'),
  env.get('GOOGLE_REDIRECT_URI')
)

oAuth2Client.setCredentials({
  refresh_token: env.get('GOOGLE_REFRESH_TOKEN'),
})

export async function sendMail(
  to: string,
  subject: string,
  html: string
) {
  const accessToken = await oAuth2Client.getAccessToken()

  if (!accessToken.token) {
    throw new Error('Failed to obtain Gmail access token')
  }
console.log('ACCESS TOKEN VALUE:', accessToken.token)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: env.get('MAIL_FROM_ADDRESS'),
      clientId: env.get('GOOGLE_CLIENT_ID'),
      clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
      refreshToken: env.get('GOOGLE_REFRESH_TOKEN'),
      accessToken: accessToken.token,
    },
  })
console.log('Transporter auth config:', transporter);

  return transporter.sendMail({
    from: `"Verify App" <${env.get('MAIL_FROM_ADDRESS')}>`,
    to,
    subject,
    html,
  })
}

