module.exports = async (req, res, next) => {
  try {
    // you may want to make this more specific -- since req.user is an object,
    // simply having an empty object would pass this check
    if (!req.user?.email)
      throw new Error('You do not have access to view this page');

    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
