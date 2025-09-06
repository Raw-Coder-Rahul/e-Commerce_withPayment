export default (myErrorFunction) => {
  return (req, res, next) => {
    myErrorFunction(req, res, next).catch((error) => {
      next(error);
    });
  };
}