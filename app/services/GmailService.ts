import env from '#start/env'
import { google } from 'googleapis'

const oAuth2Client = new google.auth.OAuth2(
  env.get('GOOGLE_CLIENT_ID'),
  env.get('GOOGLE_CLIENT_SECRET'),
  env.get('GOOGLE_REDIRECT_URI')
)

oAuth2Client.setCredentials({
  refresh_token: env.get('GOOGLE_REFRESH_TOKEN'),
})

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

export async function sendMail(to: string, subject: string, html: string) {
  const rawMessage = Buffer.from(
    `From: "Verify App" <${env.get('MAIL_FROM_ADDRESS')}>\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +
    `${html}`
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawMessage,
    },
  })
}
