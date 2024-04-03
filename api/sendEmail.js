require('dotenv').config()
const { default: axios } = require('axios');
const nodemailer = require('nodemailer');

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
const nytJobUrl = 'https://boards-api.greenhouse.io/v1/boards/thenewyorktimes/jobs';

let previousState = null

const getJobs = async () => {
  try {
    const response = await axios.get(nytJobUrl)
    const data = await response.data

    return data
  } catch (error) {
    console.log('Failed to fetch Jobs', error)
  }
}


async function sendEmail() {
  const jobData = await getJobs()
  // console.log(jobData.meta.total)
  // console.log("me first")


  emailHandler(jobData)


  function emailHandler(jobData) {
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


    console.log("inside emailHandler", JSON.stringify(previousState) === JSON.stringify(jobData))

    let mailOptions = (JSON.stringify(jobData) !== JSON.stringify(previousState)) ? {
      from: email,
      to: email,
      subject: `${jobData.jobs.length} NYT Jobs Updated`,
      text: 'The data has been updated',
      html: `<h1>NYT Job Update</h1>${jobsHtml}`
    } : {
      from: email,
      to: email,
      subject: `${jobData.jobs.length} NYT Jobs: No Updates`,
      text: 'The data hasnt been updated',
      html: `<h1>There have been no updates</h1>${jobsHtml}`
    }

    // console.log("mailOptions:", mailOptions.subject)

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error Sending Email:', error)
      } else {
        console.log('Email sent:', info.response)
      }
    })

    previousState = jobData
    console.log("end of handler", JSON.stringify(previousState) === JSON.stringify(jobData))
  }
}

// (async () => {
//   await sendEmail();

//   // Check the value of previousState here...
// })();

// setTimeout(async () => await sendEmail(), 2000)


module.exports = async (req, res) => {
  try {
    await sendEmail();
    console.log("first call ran")
    setTimeout(async () => await sendEmail(), 2000)
    console.log("second call ran")
    res.status(200).send('Email sent');
  } catch (error) {
    res.status(500).send('An error occurred while sending email');
  }
};