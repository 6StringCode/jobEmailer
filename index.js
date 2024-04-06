require('dotenv').config()
const express = require('express');
const sendEmail = require('./api/sendEmail');

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.listen(PORT, () => console.log(`App running on port ${PORT}`))



//old stuff for testing
// app.get('/api/sendEmail', async (res) => {
//   try {
//     const data = await sendEmail(res);
//     res.json(data);
//   } catch (error) {
//     res.status(500).send('An error occurred while fetching jobs');
//   }
// });

// app.post('/send-email', sendEmail);