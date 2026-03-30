const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// fake database (for now)
let bookings = [];

// ✅ EMAIL SETUP (GMAIL)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abdulnona25@gmail.com', // your gmail
        pass: 'puzv kgna sbpq legh'     // 16 digit app password
    }
});

// test route
app.get('/', (req, res) => {
    res.send('Server running');
});

// 👉 CREATE BOOKING
app.post('/book', async (req, res) => {
    const { name, phone, time } = req.body;

    // ❌ check if time already booked
    const exists = bookings.find(b => b.time === time);

    if (exists) {
        return res.status(400).json({
            message: 'This time is already booked'
        });
    }

    // ❌ check working hours
    if (time < "09:00" || time > "18:30") {
        return res.status(400).json({
            message: 'Outside working hours'
        });
    }

    const newBooking = {
        id: bookings.length + 1,
        name,
        phone,
        time
    };

    bookings.push(newBooking);

    // ✅ SEND EMAIL TO BARBER
    try {
        await transporter.sendMail({
            from: 'abdulnona25@gmail.com',
            to: 'abdulnona25@gmail.com', // barber email (can be same)
            subject: 'New Booking Request',
            text: `
New booking:

Name: ${name}
Phone: ${phone}
Time: ${time}

Call or text the customer to confirm.
            `
        });
    } catch (err) {
        console.log("Email error:", err);
    }

    res.json({
        message: 'Booking request sent',
        booking: newBooking
    });
});

// 👉 GET BOOKINGS
app.get('/bookings', (req, res) => {
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});