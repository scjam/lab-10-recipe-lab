module.exports = (req, res, next) => {
  const err = new Error(`Recipe with id ${req.params.id} not found`);
  err.status = 404;
  next(err);
};
