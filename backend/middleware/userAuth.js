import handleAsyncError from "./handleAsyncError.js";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  // Your authentication logic here
  const token = req.cookies;
  console.log(token);
});