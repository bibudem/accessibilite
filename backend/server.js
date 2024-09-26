const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config/config');
const parseurl = require('parseurl');

const app = express();
const ports = process.env.PORT || config.serverPort;

const bs = require('browser-storage');
const Lib = require("./util/lib");
const request = require("request");
const auth = require("./auth/auth");
const userUdemRoutes = require('./routes/userUdem');

//****** Configuration du proxy global ************//
const proxy = require("node-global-proxy").default;
proxy.setConfig(config.proxy);
proxy.start();

//*********************************************//

const collectionsRoutes = require('./routes/collections');
const panierRoutes = require('./routes/panier');
const itemsRoutes = require('./routes/items');
const homeRoutes= require('./routes/home');
const homeLink= require('./routes/link');

app.use(bodyParser.json());

// Middleware pour les en-têtes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware de session
app.use(session({
  secret: 'accessibilite*2023!!',
  cookie: { maxAge: 3600000 },
  resave: true,
  saveUninitialized : true
}));

// Middleware pour le comptage des vues
app.use((req, res, next) => {
  req.session.views = req.session.views || {};
  const pathname = parseurl(req).pathname;
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  next();
});

// Définir proxy url dans la création du serveur
app.set('trust proxy', '10.120.31.31');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(auth.passport.initialize());
app.use(auth.passport.session());

// Middleware pour le comptage des vues (encore une fois?)
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  // get the url pathname
  const pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
});

// Route de déconnexion
app.get('/logout', function(req, res) {
  req.logOut()  // <-- not req.logout();
  if(Lib.userConnect(req)){
    Lib.userConnect(req)==[]
  }
  req.session.destroy(function() {
    res.clearCookie('connect.sid');
    res.redirect('/not-user')
  });
});
//redirection pour se connecter
app.get('/', function(req, res) {
  if(!Lib.userConnect(req)|| Lib.userConnect(req).length==0){
    res.redirect('/not-user')
  }
});

app.use('/auth', userUdemRoutes);

// Contrôleur revue
app.use('/collections', collectionsRoutes);

// Contrôleur panier
app.use('/panier', panierRoutes);

// Contrôleur items
app.use('/items', itemsRoutes);

// Contrôleur pour les données de board
app.use('/home', homeRoutes);

// Contrôleur pour les liens de récupération
app.use('/link', homeLink);

//passport user
app.use('/user-udem', userUdemRoutes);

const passport = require('passport');

// Passport user
app.get('/passport-connect-user', function (req, res, next) {
  passport.authenticate('provider', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).json(user);
    });
  })(req, res, next);
});


app.listen(ports, () => console.log(`listening on port ${ports}`));
