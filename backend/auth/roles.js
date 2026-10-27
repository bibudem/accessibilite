const UserAuth = require('./callback');

// Retourne l'utilisateur de la session ({ nom, prenom, courriel, groupe }) ou null si non connecté
async function utilisateurSession(req) {
  const brut = req.session?.passport?.user?.[req.session?.token];
  if (!brut) {
    return null;
  }
  const [utilisateur] = await UserAuth.returnUserUdem(brut);
  return utilisateur;
}

// Contrairement à authMiddleware (redirection HTML), répond en JSON :
// ces routes sont appelées en XHR, une page HTML serait enregistrée comme fichier.
exports.exigerConnexion = async (req, res, next) => {
  try {
    const utilisateur = await utilisateurSession(req);
    if (!utilisateur) {
      return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' });
    }
    req.utilisateur = utilisateur;
    next();
  } catch (err) {
    next(err);
  }
};

// Autorise seulement les groupes donnés ('Admin' = gestionnaires, 'Viewer' = bibliothécaires)
function exigerRoles(...groupes) {
  return async (req, res, next) => {
    try {
      const utilisateur = await utilisateurSession(req);
      if (!utilisateur) {
        return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' });
      }
      if (!groupes.includes(utilisateur.groupe)) {
        return res.status(403).json({ message: 'Accès non autorisé pour votre profil.' });
      }
      req.utilisateur = utilisateur;
      next();
    } catch (err) {
      next(err);
    }
  };
}

exports.exigerRoles = exigerRoles;
exports.exigerAdmin = exigerRoles('Admin');
