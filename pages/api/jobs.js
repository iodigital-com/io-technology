const parser = require('xml2js')

export default async (req, res) => {
  const baseURL = 'https://www.iodigital.com/api/job-feed'

  const {
    offers: { offer: offers },
  } = await fetch(baseURL)
    .then((res) => res.text())
    .then((res) => parser.parseStringPromise(res, { explicitArray: false }))
    .catch((err) => console.error(err))

  const jobs = offers
    .map((offer) => ({
      id: offer.id,
      title: offer.title.trim(),
      location: offer.location,
      country: offer.country,
      city: offer.city,
      postal_code: offer.postal_code,
      country_code: offer.country_code,
      department: offer.department,
      employment_type: offer.employment_type_code,
      category: offer.category,
      experience: offer.experience_code,
      education: offer.education_code,
      tags: offer.tags,
      min_hours: parseInt(offer.min_hours),
      max_hours: parseInt(offer.max_hours),
      careers_url: offer.careers_url,
      created_at: new Date(offer.created_at.at(0)),
      updated_at: new Date(offer.updated_at.at(0)),
      published_at: new Date(offer.published_at.at(0)),
      closed: offer.close_at,
    }))
    .filter((job) => job.department === 'Technology')

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ jobs }))
}
