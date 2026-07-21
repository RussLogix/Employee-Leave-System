const managerOnly = (req, res, next) => {
  if (req.user?.role !== "Manager") {
    return res.status(403).json({
      message: "Manager access required.",
    });
  }

  next();
};

export default managerOnly;