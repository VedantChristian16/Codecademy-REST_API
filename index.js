import express from 'express';
import { v4 as uuid } from 'uuid';
import cors from 'cors';
import session from 'express-session';

import { json, urlencoded } from 'body-parser';


import { authenticateUser } from './db/userqueries';

import { use, initialize, session as _session, serializeUser, deserializeUser, authenticate } from 'passport';
import LocalStrategy from 'passport-local';

const app = express();

const FileStore = require('session-file-store')(session);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

 // Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());

// Configure local strategy to be use for local login
use(new LocalStrategy(
  { usernameField: 'email' },
   async (email, password, done) => {
     try {
      console.log('inside passport');
       const user =  await authenticateUser({ email: email, password : password});
       console.log('Local strategy returned true');
       console.log(user);
       return done(null, user);
     } catch(err) {
      console.log('Local strategy returned false');
       return done(err);
     }
   }
 ));
  // Transforms raw string of req.body into JSON
  app.use(json());

// Creates a session
app.use(
  session({  
    genid: (req) => {
      console.log('Inside session middleware genid function')
      console.log(`Request object sessionID from client: ${req.sessionID}`)
      return uuid() // use UUIDs for session IDs
    },
    secret: process.env.SESSION_SECRET || "session_secret",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(urlencoded({ extended: false }));

 // Initialize passport
 app.use(initialize());  
 app.use(_session());
 
 // Set method to serialize data to store in cookie
 serializeUser((user, done) => {
  console.log('serializing');
  done(null, user.id);
 });
 
 // Set method to deserialize data stored in cookie and attach to req.user
 deserializeUser((id, done) => {
  console.log('deserializing');
  done(null, id);
  // const user = users[0].id === id ? users[0] : false; 
 // done(null, user);
 });

 

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

/*  Login Endpoint*/
app.post('/auth/login', (req, res, next) => {
  console.log('Inside POST /login callback')
  authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, (err) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      return res.status(200).send('You were authenticated & logged in!\n');
    })
  })(req, res, next);
})
/*  Check auth*/
app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback')
  console.log(`User authenticated? ${req.user}`);
  console.log(req.session);
  console.log(`User authenticated? ${(req.session)}`);
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    console.log('invalid');
    res.send('invalid');
  }
})
import userRouter from './routes/user';
app.use('/users',userRouter);
    
import cartRouter from './routes/cart';
app.use('/cart',cartRouter);
import productRouter from './routes/product';
app.use('/products',productRouter);
import orderRouter from './routes/order';
app.use('/orders',orderRouter);

import { serve, setup } from 'swagger-ui-express';
//const yaml = require('js-yaml');
//const fs = require('fs');
//const path = require('path');

// Loading via yml.safeLoad to avoid errors with special characters during processing
//const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, './swagger.yml'), 'utf8'));
import swaggerDocument from './swagger.json';

  // Serves Swagger API documentation to /docs url
  app.use('/docs', serve, setup(swaggerDocument));

  app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})