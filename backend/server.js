const express = require('express');

const bodyParser = require('body-parser');

const session = require('express-session')

const collectionsRoutes = require('./routes/collections');

const itemsRoutes = require('./routes/items');

const suiviRoutes = require('./routes/suivi');

const outilsRoutes = require('./routes/outils');

const homeRoutes= require('./routes/home');

const homeLink= require('./routes/link');

const config = require('./config/config');

const app = express();

const ports = process.env.PORT || config.serverPort;

const Lib  = require("./util/lib")


//******proxy configuration global************//

const proxy = require("node-global-proxy").default;

proxy.setConfig(config.proxy);

proxy.start();

//*********************************************//

app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Definir proxy url dans la creation du serveur
app.set('trust proxy', '10.139.33.12');

//controlleur revue
app.use('/collections', collectionsRoutes);

//controlleur items
app.use('/items', itemsRoutes);

//controlleur suivi
app.use('/suivi', suiviRoutes);

//controlleur pour les données de board
app.use('/home', homeRoutes);

//controlleur pour les liens de recuperation
app.use('/link', homeLink);


//controlleur pour outils
app.use('/outils',outilsRoutes);


app.listen(ports, () => console.log(`listening on port ${ports}`));




