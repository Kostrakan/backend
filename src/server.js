require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const kosRoutes = require('./routes/kos.routes');
const roomRoutes = require('./routes/rooms.routes');
const favoriteRoutes = require('./routes/favorites.routes');
const userRoutes = require('./routes/user.routes');
const authRoute = require('./routes/auth.routes');


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/kos', kosRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
