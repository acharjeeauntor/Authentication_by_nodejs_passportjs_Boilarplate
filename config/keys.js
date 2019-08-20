dbPassword =
  "mongodb+srv://maxi_shop_project:auntor@cluster0-u60el.mongodb.net/AuthByPassport";

module.exports = {
  mongoURI: dbPassword,
  facebookAuth: {
    clientID: "472154820283428",
    clientSecret: "e269220d1b8e77b7053da87ddd005242",
    callbackURL: "http://localhost:5000/auth/facebook/callback"
  },
  googleAuth: {
    clientID:
      "412960817088-hgc1k5sh0rlidsa6u7a14kogmisack7f.apps.googleusercontent.com",
    clientSecret: "7WnvF5y8WfJZcxml_6B8AeAx",
    callbackURL: "http://localhost:5000/auth/google/callback"
  }
};

//must remember that when create a google Credentials we have to use http://......
//not use https in the place of http..then save the credential
