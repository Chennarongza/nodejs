const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const ACCESS_TOKEN = 'wlVgum1qSq5ghcn0EHt2O96OlDTHA80IKDgqffDkb0IWG1LcZ+r1+NbRSb6C2ee6V9R726WuyBha698bMpn7LZ8NRtbHAdPrCuEKSI6UDu4405sV9EQfard2lSV7W+r5i8Dy8jYEWl7SfJhcBOR9UgdB04t89/1O/w1cDnyilFU='; // ใส่ Channel Access Token ที่ได้จาก Line Developer Console

app.use(bodyParser.json());

// Webhook ที่รับข้อมูลจาก Line
app.post('/webhook', (req, res) => {
  const events = req.body.events;

  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      const message = {
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: `คุณพิมพ์ว่า: ${userMessage}`
          }
        ]
      };

      axios.post('https://api.line.me/v2/bot/message/reply', message, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      })
      .then(() => {
        console.log('Message sent!');
      })
      .catch((err) => {
        console.error('Error:', err);
      });
    }
  });

  res.sendStatus(200);
});

// เซิร์ฟเวอร์จะรันบนพอร์ตที่ Railway กำหนด
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});
