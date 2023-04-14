import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL || ''
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || ''

const supabaseServerClient = createClient(supabaseProjectUrl, supabaseSecretKey)

function sanitizeEmail(email) {
  // Extract email prefix and domain
  const [prefix, domain] = email.split('@')

  // Check for presence of plus sign with random string
  const prefixWithoutPlus = prefix.split('+')[0]

  // Check for presence of dots and remove them
  const prefixWithoutDots = prefixWithoutPlus.replace(/\./g, '')

  // Combine prefix without plus sign and domain
  const strippedEmail = prefixWithoutDots + '@' + domain

  return strippedEmail
}

const raffleSubmission = async (req, res) => {
  const event = req.query.id
  const { email, name } = req.body

  console.log(email, name)
  const { error: existsError, data: existsData } = await supabaseServerClient
    .from(event)
    .select('*')
    .eq('email', sanitizeEmail(email))
    .single()

  if (!existsData) {
    const { error: addEmailError } = await supabaseServerClient
      .from(event)
      .insert({ email: sanitizeEmail(email), name })
      .single()

    if (addEmailError) {
      console.error(addEmailError)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: addEmailError.message }))
      return
    }
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ email: sanitizeEmail(email), name }))
}

export default raffleSubmission
