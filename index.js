require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const { default: sendEmail } = require('./api/sendEmail')

const app = express()
const PORT = process.env.PORT || 3000

// const email = process.env.EMAIL;
// const pass = process.env.EMAIL_PASS;
// const nytJobUrl = 'https://boards-api.greenhouse.io/v1/boards/thenewyorktimes/jobs'


// sendEmail()
// setInterval(async () => {
//   try {
//     const response = await fetch(nytJobUrl)
//     const data = await response.json()

//     if (JSON.stringify(data) !== JSON.stringify(previousState)) {
//       sendEmail(data)
//     } else {
//       sendEmailWithout(data)
//     }

//     previousState = data

//   } catch (error) {
//     console.log('Failed to fetch Jobs', error)
//   }
//   // }, 6 * 60 * 60 * 1000) //6hrs
// }, 1000) //6hrs

// async function getJobs() {
//   const response = await fetch(nytJobUrl)
//   const data = await response.json()
//   const jobs = data.jobs
//   console.log(data.meta.total)
// }

// if (JSON.stringify(data) !== JSON.stringify(previousState)) {
//   sendEmail(data)
// } else {
//   sendEmailWithout(data)
// }

// previousState = data





// function sendEmail(jobData) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: email,
//       pass
//     }
//   })

//   const jobsHtml = jobData.jobs.map(job => {
//     const date = new Date(job.updated_at).toLocaleString();
//     return `<a href="${job.absolute_url}"><b>${job.title}</b> - Updated at: ${date}</a><br/>`;
//   }).join('')


//   const mailOptions = {
//     from: email,
//     to: email,
//     subject: `${jobData.jobs.length} NYT Jobs Updated`,
//     text: 'The data has been updated',
//     html: `<h1>NYT Job Update</h1>${jobsHtml}`
//   }

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error Sending Email:', error)
//     } else {
//       console.log('Email sent:', info.response)
//     }
//   })
// }

// function sendEmailWithout(jobData) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: email,
//       pass
//     }
//   })

//   const jobsHtml = jobData.jobs.map(job => {
//     const date = new Date(job.updated_at).toLocaleString();
//     return `<a href="${job.absolute_url}"><b>${job.title}</b> - Updated at: ${date}</a><br/>`;
//   }).join('')


//   const mailOptions = {
//     from: email,
//     to: email,
//     subject: `${jobData.jobs.length} NYT Jobs: No Updates`,
//     text: 'The data hasnt been updated',
//     html: `<h1>There have been no updates</h1>${jobsHtml}`
//   }

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error Sending Email:', error)
//     } else {
//       console.log('Email sent:', info.response)
//     }
//   })
// }

app.listen(PORT, () => console.log(`App running on port ${PORT}`))
