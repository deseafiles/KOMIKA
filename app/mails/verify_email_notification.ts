import { Resend } from 'resend'
import env from '#start/env'

const resend = new Resend(env.get('RESEND_API_KEY'))

export async function sendVerifyEmail(to: string, url: string) {
  try {
    const result = await resend.emails.send({
      from: 'webkomika@gmail.com',
      to,
      subject: 'Verify your email',
      html: `<a href="${url}">Verify</a>`,
    })

    console.log('RESEND RESULT >>>', result)
  } catch (error) {
    console.error('RESEND ERROR >>>', error)
    throw error
  }
}

export default sendVerifyEmail
