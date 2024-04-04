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
    // console.log(data)
    return data
  } catch (error) {
    console.log('Failed to fetch Jobs', error)
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass
  }
})

const transporterHandler = async (mailOptions, callback) => {
  try {
    const info = await transporter.sendMail(mailOptions)
    callback(info)
    console.log('Email sent:', info.response)
  } catch (error) {
    console.log('Error Sending Email:', error)
  }
}

// const transporterHandler = transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log('Error Sending Email:', error)
//   } else {
//     console.log('Email sent:', info.response)
//   }
// })


async function sendEmail(res) {
  const jobData = await getJobs()
  // console.log(jobData.meta.total)


  //Email Html Formatting
  const jobsHtml = jobData.jobs.map(job => {
    const date = new Date(job.updated_at).toLocaleString();
    return `<a href="${job.absolute_url}"><b>${job.title}</b> - Updated at: ${date}</a><br/>`;
  }).join('')


  // console.log("inside emailHandler", JSON.stringify(previousState) === JSON.stringify(jobData))

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

  console.log("mailOptions:", mailOptions.subject)

  try {
    // await new Promise((resolve, reject) => {
    //   transporter.verify(async (error, success) => {
    //     if (error) {
    //       console.log(error);
    //       reject(error)
    //     } else {
    //       console.log("Server is ready to take our messages");
    //     }
    //   });
    // })

    await new Promise((resolve, reject) => {
      transporterHandler(mailOptions, (info) => {
        console.log("Email sent successfully");
        console.log("MESSAGE ID: ", info.messageId);
        resolve(info)
      })
    })

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log('Error Sending Email:', error)
    //   } else {
    //     console.log('Email sent:', info.response)
    //   }
    // })

    //verify that we get here
    console.log("We got here")

    previousState = jobData
    res.status(200).send('Email sent')
  } catch (error) {
    console.log('An error occurred while sending email', error)
    res.status(500).send('An error occurred while sending email')
  }
}

// sendEmail();

// setTimeout(async () => await sendEmail(), 2000)


module.exports = async (req, res) => {
  try {
    await sendEmail(res)
    console.log("first call ran")
    // setTimeout(() => console.log("setTimeout"), 3000)

    res.status(200).send('Email sent');
  } catch (error) {
    res.status(500).send('An error occurred while sending email');
  }
};