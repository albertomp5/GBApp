'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require('fs');

const app = express();

//basedir
global.__basedir = __dirname;

//CORS
var corsOptions = {
  origin: "http://localhost:8080"
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, x-access-token ,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//para las imagenes
app.use('/static', express.static('upload'));

//para la web
app.use('/', express.static('static'));

//rutas
var userRoutes = require('./routes/router');
app.use('/api', userRoutes);



// HTTPS
const USE_HTTPS = process.env.USE_HTTPS || true;
const HTTP_PORT = process.env.PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

if(USE_HTTPS === true){

  // redirect to https
  http.createServer(function(request, response){
      response.writeHead(301, { Location: 'https://' + request.headers.host + request.url });
      response.end();
  }).on("error", (e) => {
      console.log(`[HTTP] ${e}`);
  }).listen(HTTP_PORT, () => {
      console.log(`[HTTP] Application redirection listening on ${HTTP_PORT}`);
  });
  
  // https server
  https.createServer({
      ca: fs.readFileSync('/root/certs/fullchain.pem'),
      key: fs.readFileSync('/root/certs/privkey.pem'),
      cert: fs.readFileSync('/root/certs/cert.pem')
  }, app).on("error", (e) => {                
      console.log(`[HTTPS] ${e}`);
  }).listen(HTTPS_PORT, () => {
    console.log(`[HTTP] Application listening on ${HTTPS_PORT}`);  
  });

}else{
  
  // register http server
  http.createServer(app).on("error", (e) => {                
    console.log(`[HTTP] ${e}`);
  }).listen(HTTP_PORT, () => {
    console.log(`[HTTP] Application listening on ${HTTP_PORT}`);
  });

}


const db = require("./models");
const Role = db.role;
const Gym = db.gym;
global.gymID = "";
const Padel = db.padel;
global.padelID = "";
const Booking = db.booking;
const PadelBooking = db.padelbooking;

db.mongoose.set('useFindAndModify', false);
//        useCreateIndex: true,
//        autoIndex: true,

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });

  Gym.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Gym({
        aforoActual: 0,
        maxAforo: 10,
        horario: "empty",
        nMaquinas: 0,
      }).save((err, gym) => {
        if (err) {
          console.log("error", err);
        }
        else {
          gymID = gym._id;
        }

        console.log("added 'gym' to gym collection");
      });
    } else if (!err && count === 1) {
      Gym.findOne({})
        .then(gym => {
          if (gym) {
            gymID = gym._id;
          }
        }).catch(err => {
          console.log("¡Error!" + err);
        });
    }
  });

  Padel.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Padel({
        horario: "empty",
        isBookedNow: false
      }).save((err, padel) => {
        if (err) {
          console.log("error", err);
        }
        else {
          padelID = padel._id;
        }
        console.log("added 'padel' to padel collection");
      });
    } else if (!err && count === 1) {
      Padel.findOne({})
        .then(padel => {
          if (padel) {
            padelID = padel._id;
          }
        })
        .catch(err => {
          console.log("¡Error!" + err);
        });
    }
  });

  Booking.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Booking({
        actualBooks: 0
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'booking' to booking collection");
      });
    }
  });

  PadelBooking.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new PadelBooking({
        isBooked: false
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'padelBooking' to padelBooking collection");
      });
    }
  });
}
