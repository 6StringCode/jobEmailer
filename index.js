require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')

const app = express()
const PORT = process.env.PORT || 3000

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
const nytJobUrl = 'https://boards-api.greenhouse.io/v1/boards/thenewyorktimes/jobs'

let previousState = null

setInterval(async () => {
  console.log('setInterval')
  try {
    const response = await fetch(nytJobUrl)
    const data = await response.json()

    if (JSON.stringify(data) !== JSON.stringify(previousState)) {
      sendEmail(data)
    }

    previousState = data

  } catch (error) {
    console.log('Failed to fetch Jobs', error)
  }
}, 6 * 60 * 60 * 1000) //6hrs


function sendEmail(jobData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass
    }
  })

  const jobsHtml = jobData.jobs.map(job => {
    const date = new Date(job.updated_at).toLocaleString();
    return `<a href="${job.absolute_url}"><b>${job.title}</b> - Updated at: ${date}</a><br/>`;
  }).join('')


  const mailOptions = {
    from: email,
    to: email,
    subject: 'NYT Jobs Update',
    text: 'The data has been updated',
    html: `<h1>NYT Job Update</h1>${jobsHtml}`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error Sending Email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

app.listen(PORT, () => console.log(`App running on port ${PORT}`))
