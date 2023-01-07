module.exports = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
    return;
  }
  else {
    res.redirect("login-signup");
  }
}