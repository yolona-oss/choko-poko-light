export const REFRESH_TOKEN = {
  //secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  cookie: {
    name: "refreshTkn",
    options: {
      sameSite: false,
      secure: true,
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
};

export const RESET_PASSWORD_TOKEN = {
  expiry: process.env.JWT_REFRESH_TOKEN_OPTION_EXPIRES_IN, // :-(
};

export const REQUSET_USER_KEY = 'user'
