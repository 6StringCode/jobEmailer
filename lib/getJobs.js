const { default: axios } = require('axios');

const nytJobUrl = 'https://boards-api.greenhouse.io/v1/boards/thenewyorktimes/jobs'

const getJobs = async () => {
  try {
    const response = await axios.get(nytJobUrl)
    const data = await response.data

    return data
  } catch (error) {
    console.log('Failed to fetch Jobs', error)
  }
}

module.exports = getJobs