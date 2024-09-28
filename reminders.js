const twilio = require('twilio');

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

function sendReminderSMS(phoneNumber, message) {
  client.messages
    .create({
      body: message,
      from: '918132810045', // Your Twilio phone number
      to: phoneNumber
    })
    .then(message => console.log(`Reminder sent: ${message.sid}`))
    .catch(err => console.error(err));
}

module.exports = { sendReminderSMS };
