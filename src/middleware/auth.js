exports.protect = async (req, res, next) => {
  try {
    if (req.user) {
      console.log(req.user)
      next()
    } else {
      return res.status(401).json({
        success: false,
        error: 'Not authorize to access this route',
      })
    }
  } catch (err) {
    console.error(err)
    res.status(400).json({
      success: false,
      error: err.message,
    })
  }
}
