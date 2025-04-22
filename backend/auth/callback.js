const auth = require("./auth");  // Importation du module 'auth'

module.exports = class UserAuth {

// ...

  static async returnUserUdem(param) {
    let userConnect = {};
    userConnect['groupe'] = 'User';
    //console.log(auth.passport.session.userConnect);
    if (auth.passport.session.userConnect) {
      if (!auth.passport.session.userConnect[param]) {
        return [userConnect];
      }

      let user = JSON.parse(auth.passport.session.userConnect[param]);
      //console.log(user);
      for (const [param, val] of Object.entries(user)) {
        switch (param) {
          case 'family_name':
            userConnect['nom'] = val;
            break;
          case 'given_name':
            userConnect['prenom'] = val;
            break;
          case 'upn':
            userConnect['courriel'] = val;
            break;
          case 'groups':
            if (val.includes('bib-aut-accessibilite-gestionnaires')) {
              userConnect['groupe'] = 'Admin';
            }
            if (val.includes('bib-aut-accessibilite-lecteurs') && !val.includes('bib-aut-accessibilite-gestionnaires')) {
              userConnect['groupe'] = 'Viewer';
            }
            break;
          case 'ip':
            userConnect['ip'] = val;
            break;
        }
      }
      //console.log(userConnect);
    }
    return [userConnect];
  }
};
