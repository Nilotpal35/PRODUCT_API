exports.errorNames = {
  UNAUTHORIZED: `UNAUTHORIZED`,
  ALREADY_EXIST: `ALREADY_EXIST`,
  SERVER_ERROR: `SERVER_ERROR`,
};

exports.errorTypes = {
  UNAUTHORIZED: {
    message: "USER NOT AUTHORIZED",
    statusCode: 404,
  },
  ALREADY_EXIST: {
    message: "USER ALREADY EXIST",
    statusCode: 403,
  },
  SERVER_ERROR: {
    message: "BACKEND ERROR",
    statusCode: 500,
  },
};
