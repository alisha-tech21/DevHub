const DEMO_EMAIL = process.env.DEMO_EMAIL;

module.exports = (req, res, next) => {
  if (req.user.email === DEMO_EMAIL) {
    return res.status(403).json({
      message: "Demo account is read-only.",
    });
  }

  next();
};
