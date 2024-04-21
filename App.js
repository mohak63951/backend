const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const compression = require("compression");
const auth = require("./routes/auth");
const admin = require("./routes/adminRoute");
const upcoming = require("./routes/upcomingRoutes");
const session = require("express-session");
const blog = require("./routes/blogroutes");
const contact = require("./routes/contactusroute");
const orderRouter = require("./routes/orderRoute");
const google = require("./routes/google-outh.route");
const chat = require("./routes/chatroutes");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.enable("trust-proxy");

// Set a security HTTP Header
app.use(helmet());
// app.use(cors("*"))
// Set a rate-limtiter to a particular ip
const limiter = rateLimit({
  max: 500,
  windowms: 30 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use(
  session({
    secret: "this-is-my-super-longer-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "none", // Adjust based on your needs
      secure: true, // Make sure to use HTTPS in production
    },
  })
);
app.use(limiter);

// Data Sanitization against NoSql Query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

//Body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());
//Allowing requested resources

// Generating logs
console.log(process.env.NODE_ENV);
app.use(morgan("dev"));

// compress the text data
app.use(compression());

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes

app.use("/api/v1/blogs", blog);


// 660bdd4fdf0a326d60849611
// Global Error Handler
//  app.all('*', (req,res,next)=>{
//      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//  });

//  app.use(globalErrorHandler);

module.exports = app;
