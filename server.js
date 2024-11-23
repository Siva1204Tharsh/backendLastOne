const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");

const User = require("./models/userModel");
const bcrypt = require("bcrypt");

const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");

//db connection
process.env.MONGO_URI = 'mongodb://localhost:27017/intournetExplorer';
const connectDB = require("./config/db");
connectDB();

// Middlewares
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Function to create an initial admin user
async function createInitialAdmin() {
  try {
    const adminExists = await User.findOne({ type: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new User({
        name: process.env.ADMIN_USERNAME,
        email: 'admin@gmail.com',
        mobile: process.env.ADMIN_MOBILE,
        country: process.env.ADMIN_COUNTRY,
        type: 'admin',
        isAdmin: true,
        password: hashedPassword,
      });
      await admin.save();
      console.log('Initial admin user created');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
}
createInitialAdmin();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);

const tourRouter = require("./routes/tourRouter");
app.use("/api/tours", tourRouter);
app.use("/api/tourreservation", tourRouter);

const hotels = require("./routes/hotels");
const rooms = require("./routes/rooms");
const hotelreservation = require("./routes/hotelReservationRoute");

app.use("/api/hotels", hotels);
app.use("/api/rooms", rooms);
app.use("/api/hotelreservation", hotelreservation);
app.use("/api/hotels/images", express.static(path.join(__dirname, "images")));

const restaurantRoute = require("./routes/restaurantRoute.js");
const restaurantTypeRoute = require("./routes/restaurantTypeRoute");
const restaurantDistrictRoute = require("./routes/restaurantDistrictRoute");
const restaurantReservationTimeRoute = require("./routes/restaurantReservationTimeRoute");
const restaurantRateRoute = require("./routes/restaurantRateRoute");
const restaurantReservationRoute = require("./routes/restaurantReservationRoute");

// Janar
app.use("/api/restaurant", restaurantRoute);
app.use("/api/restaurantType", restaurantTypeRoute);
app.use("/api/restaurantDistrict", restaurantDistrictRoute);
app.use("/api/restaurantReservationTime", restaurantReservationTimeRoute);
app.use("/api/restaurantRate", restaurantRateRoute);
app.use("/api/restaurantReservation", restaurantReservationRoute);

const refundRouter = require("./routes/RefundRoute");
app.use("/api/refund", refundRouter);

const EmployeeRouter = require("./routes/EmployeeRoute");
app.use("/api/employee", EmployeeRouter);

const SalaryRouter = require("./routes/SalaryRoute");
app.use("/api/salary", SalaryRouter);

const RecordRouter = require("./routes/FinanceHealth");
app.use("/api/record", RecordRouter);

const ActivityRoute = require("./routes/activityRoute");
const ReservationRoute = require("./routes/reservationRoute.js");

app.use("/api/activities", ActivityRoute);
app.use("/api/reservations", ReservationRoute);

app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

// Port Configuration
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server running on port ${port} `)
);

// Socket.IO setup
const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    origin: "http://localhost:3000", // Ensure this matches your frontend's URL
    credentials: true,
  },
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Attach io to app for access in routes
app.set('io', io);