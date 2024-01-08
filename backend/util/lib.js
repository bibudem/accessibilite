const auth = require("../auth/auth");
const datetime = require("node-datetime");
module.exports = class Lib {
  constructor() {

  }

  //creation de la date actuelle avec le format souhaiter
  static dateNow(format){
    let dt = datetime.create();
    let date = dt.format(format);
    return date
  }

  //creation d'un token d'utilisateur
  static sessionToken(req) {
    const projet = 'accessibilite2023';
    const ipLocal = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const dateSession = this.dateNow('d.m.Y');
    const token = `${ipLocal}.${dateSession}.${projet}`;
    return token;
  }


  static userConnect(req){
    if(!auth.passport.session.userConnect){
      return []
    }
    if(!auth.passport.session.userConnect[this.sessionToken(req)]){
      return []
    }
    return JSON.parse(auth.passport.session.userConnect[this.sessionToken(req)])
  }
};
