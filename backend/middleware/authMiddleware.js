const protect = (req, res, next) => {
  next();
};

const optionalAuth = (req, res, next) => {
  next();
};

module.exports = { protect, optionalAuth };

