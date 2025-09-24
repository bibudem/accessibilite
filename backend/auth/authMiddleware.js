module.exports = (req, res, next) => {
  // Vérifiez d'abord si la session et le passport existent
  if (!req.session || !req.session.passport) {
    return res.redirect('/not-user');
  }

  const token = req.session.token;
  
  // Vérifiez si le token existe
  if (!token) {
    return res.redirect('/not-user');
  }

  // Vérifiez si l'utilisateur existe dans la session passport
  // Attention: req.session.passport.user[token] peut ne pas exister
  if (!req.session.passport.user || !req.session.passport.user[token]) {
    return res.redirect('/not-user');
  }

  const user = req.session.passport.user[token];
  
  // Vérifiez si l'utilisateur est valide
  if (!user || user.length === 0) {
    return res.redirect('/not-user');
  }
  
  next();
};