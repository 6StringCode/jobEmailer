require('dotenv').config()
const { Storage } = require('@google-cloud/storage');

const projectId = process.env.PROJECT_ID
const credentials = JSON.parse(process.env.KEY_FILENAME)

const storage = new Storage({ projectId, credentials })


async function uploadJobsToGCS(bucketName, filename, data) {
  try {
    const jsonString = JSON.stringify(data)

    const file = storage.bucket(bucketName).file(filename)

    await file.save(jsonString, {
      contentType: 'application/json'
    })

    console.log(`Successfully uploaded ${filename} to ${bucketName}`)

  } catch (error) {
    console.log('This is the Error:', error)
  }
}


async function downloadJobsFromGCS(bucketName, filename) {
  const [data] = await storage.bucket(bucketName).file(filename).download();
  // const jsonString = data.toString() //the above returns a buffer so we have to make it a string
  const jsonString = JSON.parse(data) //the above returns a buffer so we have to make it a string

  // console.log('Downloaded data:', jsonString);
  return jsonString
}



module.exports = { uploadJobsToGCS, downloadJobsFromGCS }