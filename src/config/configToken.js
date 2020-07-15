module.exports = {
  jwt: {
    secret: "dev-jwt",
    secretReset: "dev-jwt-reser",
    tokens: {
      access: {
        type: "access",
        expiresIn: "5m",
      },
      refresh: {
        type: "refresh",
        expiresIn: "60d",
      },
      resetPassword: {
        type: "reset",
        expiresIn: "10m",
      },
    },
  },
};
