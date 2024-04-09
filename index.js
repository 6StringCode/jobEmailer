require('dotenv').config()
const express = require('express');
const sendEmail = require('./api/sendEmail');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.listen(port, () => console.log(`App running on port ${port}`))


// app.get('/', (req, res) => {
//   res.send('Job Opening Emailer')
// })

//old stuff for testing
app.get('/api/sendEmail', async (req, res) => {
  // try {
  await sendEmail(req, res);
  // } catch (error) {
  //   console.log("error:", error)
  // res.status(500).send('An error occurred while fetching jobs', error);
  // }
});

// app.post('/send-email', sendEmail);