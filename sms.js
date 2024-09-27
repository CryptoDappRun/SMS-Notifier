const axios = require('axios');
const twilio = require('twilio');
var clicksend = require('./node_modules/clicksend/api.js');

// Twilio credentials
const accountSid = 'AC123'; // Replace with your Twilio Account SID
const authToken = '123'; // Replace with your Twilio Auth Token
const fromPhoneNumber = '+133'; // Replace with your Twilio phone number
const toPhoneNumber = '+123'; // Replace with the recipient's phone number

// ClickSend credentials
const clicksendUsername = 'xxx@gmail.com'; // Replace with ClickSend username
const clicksendApiKey = '123123';    // Replace with ClickSend API key

// RSI API URL
const url = 'https://xxx';

// Function to send SMS via Twilio
const sendSmsTwilio = (message) => {
    const client = twilio(accountSid, authToken);
    client.messages.create({
        body: message,
        from: fromPhoneNumber,
        to: toPhoneNumber,
    })
    .then(message => console.log(`Twilio SMS sent: ${message.sid}`))
    .catch(err => console.error('Failed to send SMS via Twilio:', err));
};

// Function to send SMS via ClickSend
const sendSmsClickSend = (message) => {
    const smsApi = new clicksend.SMSApi(clicksendUsername, clicksendApiKey);
    const smsMessage = {
        messages: [
            {
                source: 'nodejs',
                body: message,
                to: toPhoneNumber
            }
        ]
    };

    smsApi.smsSendPost(smsMessage)
.then(function(response) {
  console.log(response.body);
})
.catch(function(err) {
  console.error(err.body);
});
};

// Function to check value and send SMS if needed
const checkValueAndNotify = async (service = 'twilio') => {
    try {
        const response = await axios.get(url);
        const value = response.data.value;

        console.log(`Retrieved value: ${value}`);

        if (value > 90 || value < 20) {
            const message = `The value is . ${value}`;

            // Choose SMS service based on parameter
            if (service === 'twilio') {
                sendSmsTwilio(message);
            } else if (service === 'clicksend') {
                sendSmsClickSend(message);
            } else {
                console.error('Invalid SMS service selected.');
            }
        }
    } catch (error) {
        if (error.response) {
            console.error('Error fetching data:', error.response.status);
            console.error('Error details:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    }
};

// Execute the function initially with chosen SMS service
checkValueAndNotify('clicksend'); // Change 'twilio' to 'clicksend' for ClickSend

// Set interval to fetch data every 1 hour (3600000 milliseconds)
setInterval(() => checkValueAndNotify('clicksend'), 3600000); // Change 'twilio' to 'clicksend' if needed