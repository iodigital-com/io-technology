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
  const query = req.query
  // get email from query params

  if (query.email) {
    const { error: singleEmailError, data: singleEmailData } = await supabaseServerClient
      .from(event)
      .select('*')
      .eq('email', query.email)
      .single()

    if (singleEmailError) {
      console.error(singleEmailError)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: singleEmailError.message }))
      return
    }

    const { email, name } = singleEmailData
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ email, name }))
    return
  } else {
    const { error: allEmailsError, data: allEmailsData } = await supabaseServerClient
      .from(event)
      .select('*')

    if (allEmailsError) {
      console.error(allEmailsError)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: allEmailsError.message }))
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(allEmailsData.map(({ name }) => name)))
    return
  }
}

export default raffleSubmission
