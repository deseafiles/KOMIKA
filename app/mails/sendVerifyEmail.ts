import { sendMail } from '#services/GmailService'

export function sendVerifyEmail(to: string, url: string) {
  return sendMail(
    to,
    'Verify your email',
    `<a href="${url}">Verify</a>`
  )
}

export default sendVerifyEmail
