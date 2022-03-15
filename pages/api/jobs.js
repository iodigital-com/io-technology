const parser = require('xml2js')

export default async (req, res) => {
  const baseURL = 'https://www.iodigital.com/api/job-feed'

  const {
    offers: { offer: offers },
  } = await fetch(baseURL)
    .then((res) => res.text())
    .then((res) => parser.parseStringPromise(res))
    .catch((err) => console.error(err))

  const getFirstTrimmed = (arr) => arr.at(0).trim()

  const jobs = offers
    .map((offer) => ({
      id: getFirstTrimmed(offer.id),
      title: getFirstTrimmed(offer.title),
      location: getFirstTrimmed(offer.location),
      country: getFirstTrimmed(offer.country),
      city: getFirstTrimmed(offer.city),
      postal_code: getFirstTrimmed(offer.postal_code),
      country_code: getFirstTrimmed(offer.country_code),
      department: getFirstTrimmed(offer.department),
      employment_type: getFirstTrimmed(offer.employment_type_code),
      category: getFirstTrimmed(offer.category),
      experience: getFirstTrimmed(offer.experience_code),
      education: getFirstTrimmed(offer.education_code),
      tags: offer.tags,
      min_hours: parseInt(getFirstTrimmed(offer.min_hours)),
      max_hours: parseInt(getFirstTrimmed(offer.max_hours)),
      careers_url: getFirstTrimmed(offer.careers_url),
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
