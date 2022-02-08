const bcrypt = require("bcrypt");

const User = require("../schemas/user");

exports.Login = async (req, res) => {
  if (req.method == "POST") {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        res.redirect("/home");
        return;
      }
      res.redirect(`/auth?error=Wrong credentials`);
    } catch (error) {
      res.redirect(`/auth?error=${error.message}`);
    }
    return;
  }
  res.render("auth/login");
  return;
};

exports.Logout = async (req, res) => {
  req.session.loggedIn = false;
  req.session.username = null;
  res.redirect("/auth");
};

exports.Register = async (req, res) => {
  if (req.method == "POST") {
    const { username, firstname, lastname, password } = req.body;

    try {
      if (await User.findOne({ username })) {
        res.redirect(`/auth/register?error=Username has existed`);
        return;
      }

      const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
      const passwordHash = bcrypt.hashSync(password, salt);

      const user = new User({
        username,
        firstname,
        lastname,
        password: passwordHash,
      });
      await user.save();

      res.redirect(`/auth?success=Registration success`);
    } catch (error) {
      res.redirect(`/auth/register?error=${error.message}`);
    }

    return;
  }

  res.render("auth/register");
  return;
};
