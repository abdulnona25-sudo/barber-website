const express = require('express');
const app = express();

const PORT = 3000;

// middleware
app.use(express.json());

// fake database
let bookings = [];

// shop hours
const OPEN_HOUR = 8;   // 08:00
const CLOSE_HOUR = 18; // 18:00 (6PM)

// test route
app.get('/', (req, res) => {
    res.send('Barber shop backend is running');
});

// 👉 CREATE BOOKING
app.post('/book', (req, res) => {
    const { name, time } = req.body;

    // ❌ Check if fields exist
    if (!name || !time) {
        return res.status(400).json({
            message: 'Name and time are required'
        });
    }

    // ❌ Convert time (example: "14:30" → 14)
    const hour = parseInt(time.split(':')[0]);

    // ❌ Check if within working hours
    if (hour < OPEN_HOUR || hour >= CLOSE_HOUR) {
        return res.status(400).json({
            message: 'Booking must be between 08:00 and 18:00'
        });
    }

    // ❌ Check if time already booked
    const exists = bookings.find(b => b.time === time);

    if (exists) {
        return res.status(400).json({
            message: 'This time is already booked'
        });
    }

    const newBooking = {
        id: bookings.length + 1,
        name,
        time
    };

    bookings.push(newBooking);

    res.json({
        message: 'Booking request sent (barber will confirm)',
        booking: newBooking
    });
});

// 👉 GET ALL BOOKINGS
app.get('/bookings', (req, res) => {
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});