const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// test route
app.get('/', (req, res) => {
    res.send('Server running');
});

// 👉 CREATE BOOKING
app.post('/book', async (req, res) => {
    const { name, phone, time } = req.body;


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
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Booking Request',
            text: `
New booking:

Name: ${name}
Phone: ${phone}
Time: ${time}

The customer has been asked to call or WhatsApp the shop to confirm. No need to contact them first.
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