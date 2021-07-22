import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on server
    return axios.create({
      baseURL: 'http://www.tickets.styledslippers.com/',
      headers: req.headers,
    })
  } else {
    return axios.create({
      baseURL: '/',
    })
  }
}

export default buildClient
