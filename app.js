const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

// ใช้ body-parser เพื่อรองรับข้อมูลแบบ JSON
app.use(bodyParser.json());

const LINE_API_URL = 'https://api.line.me/v2/bot/message/reply';
const ACCESS_TOKEN = 'wlVgum1qSq5ghcn0EHt2O96OlDTHA80IKDgqffDkb0IWG1LcZ+r1+NbRSb6C2ee6V9R726WuyBha698bMpn7LZ8NRtbHAdPrCuEKSI6UDu4405sV9EQfard2lSV7W+r5i8Dy8jYEWl7SfJhcBOR9UgdB04t89/1O/w1cDnyilFU=';  // นำ Channel Access Token ของคุณจาก Line Developer Console มาใส่ที่นี่

// ตั้งค่า Webhook Endpoint ให้รับ POST Requests
app.post('/webhook', (req, res) => {
  const events = req.body.events;  // รับข้อมูล event ที่ส่งมาจาก Line

  // ตรวจสอบว่า event นี้เป็นการส่งข้อความ (message event)
  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;  // Reply Token สำหรับตอบกลับข้อความ
      const userMessage = event.message.text;  // ข้อความที่ผู้ใช้ส่งมา

      // สร้างข้อความที่จะตอบกลับไปหาผู้ใช้
      const message = {
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: `คุณพิมพ์ว่า: ${userMessage}`
          }
        ]
      };

      // ส่งข้อความตอบกลับผ่าน Line Messaging API
      axios.post(LINE_API_URL, message, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`  // ใช้ Channel Access Token สำหรับส่งข้อความ
        }
      })
      .then(() => {
        console.log('Message sent successfully!');
      })
      .catch((err) => {
        console.error('Error:', err);
      });
    }
  });

  // ตอบกลับ HTTP Status 200 เพื่อบอกว่า Webhook ทำงานสำเร็จ
  res.sendStatus(200);
});

// ทำให้เซิร์ฟเวอร์รับฟังบนพอร์ตที่ถูกกำหนด (เช่น PORT จาก Railway หรือ 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
