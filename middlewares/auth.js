exports.RedirectIfAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else {
    next();
  }
};

exports.SessionChecker = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/auth");
  }
};
