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

const cors = require("cors");
//db connection
process.env.MONGO_URI = 'mongodb://localhost:27017/intournetExplorer';
const connectDB = require("./config/db");
connectDB();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// Function to create an initial admin user
async function createInitialAdmin() {
  try {
    const adminExists = await User.findOne({ type: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new User({
        
        name: process.env.ADMIN_USERNAME,
        email: 'jana61jr@gmail.com',
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
// Call the function to create initial admin user
createInitialAdmin();

//to accept body data

//to use json

//middlewares


app.use(bodyParser.json({ limit: "50mb" }));

//to accept body data
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//calling the routes

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const tourRouter = require("./routes/tourRouter");
app.use("/api/tours", tourRouter);

//Mahi
const hotels = require("./routes/hotels");
const rooms = require("./routes/rooms");
const hotelreservation = require("./routes/hotelReservationRoute");

app.use("/api/hotels", hotels);
app.use("/api/rooms", rooms);
app.use("/api/hotelreservation", hotelreservation);
app.use("/api/hotels/images", express.static(path.join(__dirname, "images")));

//Siva
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



// Shamini
const refundRouter = require("./routes/RefundRoute");
app.use("/api/refund", refundRouter);

const EmployeeRouter = require("./routes/EmployeeRoute");
app.use("/api/employee", EmployeeRouter);

const SalaryRouter = require("./routes/SalaryRoute");
app.use("/api/salary", SalaryRouter);

const RecordRouter = require("./routes/FinanceHealth");
app.use("/api/record", RecordRouter);

//jana
const ActivityRoute = require("./routes/activityRoute");
const ReservationRoute = require("./routes/reservationRoute.js");

app.use("/api/activities", ActivityRoute);
app.use("/api/reservations", ReservationRoute);

app.get("/", (req, res) => {
  res.send("API is Running Succesfully");
});

/*app.get('/api/chat',(req,res) => {
    res.send(chats);
});*/

app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

/*app.get('/api/chat/:id',(req,res) =>{
    //console.log(req.params.id);
    const singleChat =chats.find((c) =>c._id ===req.params.id);
    res.send(singleChat);
});*/

//define the port number
const port = process.env.PORT || 5000;

//start the server
const server = app.listen(port, () =>
  console.log(`Server running on port ${port} `)
);

const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    orgin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
});
