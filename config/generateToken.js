const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "InTourNeTVerification", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;