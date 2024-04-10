require('dotenv').config()
const nodemailer = require('nodemailer');
const { uploadJobsToGCS, downloadJobsFromGCS } = require('../lib/storeJobs');
const getJobs = require('../lib/getJobs');

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
const bucketName = process.env.BUCKET_NAME

let previousState;


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


async function sendEmail(req, res) {
  const jobData = await getJobs()
  previousState = await downloadJobsFromGCS(bucketName, 'test.txt')


  //Email Html Formatting
  const jobsHtml = jobData.jobs.map(job => {
    const date = new Date(job.updated_at).toLocaleString();
    return `<a href="${job.absolute_url}"><b>${job.title}</b> - Updated at: ${date}</a><br/>`;
  }).join('')

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

  try {
    await new Promise((resolve, reject) => {
      uploadJobsToGCS(bucketName, "test.txt", jobData)
      // console.log(JSON.stringify(jobData) === JSON.stringify(previousState))
      // if (JSON.stringify(jobData) !== JSON.stringify(previousState)) {

      transporterHandler(mailOptions, (info) => {
        console.log("Email sent successfully");
        console.log("MESSAGE ID: ", info.messageId);
        resolve(info)
      })
      // }
    })

    // previousState = jobData
    res.status(200).send('Email sent')
  } catch (error) {
    console.log('An error occurred while sending email', error)
    if (res) {
      res.status(500).send('An error occurred while sending email')
    }
  }
  // } else {
  //   console.log("res is undefined")
  // }
  // }

  // try {
  //   await new Promise((resolve, reject) => {
  //     uploadJobsToGCS(bucketName, "test.txt", jobData)
  //     resolve(jobData)
  //   })
  //   res.status(200).send('Job Data Uploaded successfully')
  // } catch (error) {
  //   console.log('An error occurred while uploading job data', error)
  //   if (res) {
  //     res.status(500).send('An error occurred while uploading job data')
  //   }
  // }
  // await uploadJobsToGCS(bucketName, "test.txt", jobData)
}



module.exports = async (req, res) => {
  try {
    await sendEmail(req, res)
  } catch (error) {
    res.status(500).send('An error occurred while sending email');
  }
};


// const testData = {
//   jobs: [
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4357192005',
//       data_compliance: [Array],
//       internal_job_id: 4257146005,
//       location: [Object],
//       metadata: null,
//       id: 4357192005,
//       updated_at: '2024-04-05T18:03:26-04:00',
//       requisition_id: 'REQ-015993',
//       title: ' Product Designer, News App'
//     },
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4339517005',
//       data_compliance: [Array],
//       internal_job_id: 4248560005,
//       location: [Object],
//       metadata: null,
//       id: 4339517005,
//       updated_at: '2024-03-29T14:28:43-04:00',
//       requisition_id: 'REQ-015774',
//       title: 'Product Director, Ad Demand Development'
//     },
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4330089005',
//       data_compliance: [Array],
//       internal_job_id: 4242782005,
//       location: [Object],
//       metadata: null,
//       id: 4330089005,
//       updated_at: '2024-03-29T14:28:43-04:00',
//       requisition_id: 'REQ-015665',
//       title: 'Senior Data Scientist, Data and Insights, Algorithmic Recommendations'
//     },
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4366383005',
//       data_compliance: [Array],
//       internal_job_id: 4262247005,
//       location: [Object],
//       metadata: null,
//       id: 4366383005,
//       updated_at: '2024-03-29T14:28:43-04:00',
//       requisition_id: 'REQ-016159',
//       title: 'Senior Design Editor, A.I. Initiatives'
//     },
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4367003005',
//       data_compliance: [Array],
//       internal_job_id: 4262680005,
//       location: [Object],
//       metadata: null,
//       id: 4367003005,
//       updated_at: '2024-03-29T14:28:43-04:00',
//       requisition_id: 'REQ-016173',
//       title: 'Senior Software Engineer, Digital Advertising'
//     },
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4364130005',
//       data_compliance: [Array],
//       internal_job_id: 4261050005,
//       location: [Object],
//       metadata: null,
//       id: 4364130005,
//       updated_at: '2024-03-29T14:28:43-04:00',
//       requisition_id: 'REQ-016134',
//       title: 'Senior Software Engineer, Identity'
//     },
//     {
//       absolute_url: 'https://boards.greenhouse.io/thenewyorktimes/jobs/4381124005',
//       data_compliance: [Array],
//       internal_job_id: 4270313005,
//       location: [Object],
//       metadata: null,
//       id: 4381124005,
//       updated_at: '2024-03-29T14:37:56-04:00',
//       requisition_id: 'REQ-016255',
//       title: 'Software Engineer, Data Infrastructure'
//     }
//   ],
//   meta: { total: 7 }
// };




