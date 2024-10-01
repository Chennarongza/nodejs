const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');  // เพิ่ม body-parser เพื่อจัดการกับข้อมูล JSON
const axios = require('axios');  // ใช้ axios สำหรับการส่งข้อมูลไปยัง Line Messaging API
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// เพิ่มการจัดการข้อมูล JSON ด้วย body-parser
app.use(bodyParser.json());

// Use the router for handling routes
app.use('/', indexRouter);

// Endpoint สำหรับรับ Webhook จาก Line
app.post('/webhook', (req, res) => {
    const events = req.body.events;  // รับข้อมูล event ที่ส่งมาจาก Line

    events.forEach(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            const replyToken = event.replyToken;  // ดึง replyToken จาก event
            const userMessage = event.message.text;  // ดึงข้อความที่ผู้ใช้ส่งมา

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
            axios.post('https://api.line.me/v2/bot/message/reply', message, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `wlVgum1qSq5ghcn0EHt2O96OlDTHA80IKDgqffDkb0IWG1LcZ+r1+NbRSb6C2ee6V9R726WuyBha698bMpn7LZ8NRtbHAdPrCuEKSI6UDu4405sV9EQfard2lSV7W+r5i8Dy8jYEWl7SfJhcBOR9UgdB04t89/1O/w1cDnyilFU=`  // ใส่ Channel Access Token ของคุณ
                }
            })
            .then(() => {
                console.log('Message sent successfully!');
            })
            .catch((err) => {
                console.error('Error sending message:', err);
            });
        }
    });

    res.sendStatus(200);  // ตอบกลับ HTTP Status 200 เพื่อบอกว่า Webhook ทำงานสำเร็จ
});

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
