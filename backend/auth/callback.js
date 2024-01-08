const auth = require("./auth");  // Importation du module 'auth'

module.exports = class UserAuth {

  static async returnUserUdem(param) {
    let userConnect = {};  // Création d'un objet pour stocker les informations de l'utilisateur
    userConnect['groupe'] = 'not-user';  // Initialisation de la propriété 'groupe'

    if (auth.passport.session.userConnect) {
      // Vérification de l'existence de la session utilisateur
      if (!auth.passport.session.userConnect[param]) {
        return [userConnect];  // Si l'utilisateur n'est pas connecté, renvoyer l'objet userConnect tel quel
      }

      let user = JSON.parse(auth.passport.session.userConnect[param]);  // Parsing des données de l'utilisateur

      for (const [param, val] of Object.entries(user)) {
        // Itération à travers les propriétés de l'objet 'user'
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
              userConnect['groupe'] = 'Admin';  // Si l'utilisateur est dans le groupe des gestionnaires, assigner 'Admin'
            }
            if (val.includes('bib-aut-accessibilite-lecteurs') && !val.includes('bib-aut-accessibilite-gestionnaires')) {
              userConnect['groupe'] = 'Viewer';  // Si l'utilisateur est dans le groupe des lecteurs mais pas des gestionnaires, assigner 'Viewer'
            }
            break;
          case 'ip':
            userConnect['ip'] = val;
            break;
        }
      }
    }

    return [userConnect];  // Renvoyer un tableau contenant l'objet userConnect
  }
};
