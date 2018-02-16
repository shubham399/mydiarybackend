module.exports = {
  development: {
    connection_url: "mysql://dummyuser:dummy123@db4free.net:3307/dummymysql",
    api_key: "99bff15d-d4fe-44dd-a0a3-25f177535450",
    mailer_host: "smtp.sendgrid.net",
    mailer_port: "587",
    mailer_username: "apikey",
    mailer_password: process.env.MAILER_PASSWORD,
    forgotexpiry: 30.00, //mins
    resetdb: true,
    redisURL: process.env.REDIS_URL || "redis://redis-15313.c9.us-east-1-2.ec2.cloud.redislabs.com:15313",
    loginTtl:10.00*60.00, //mins
    jwtKey: process.env.JWT_KEY || "secret"
  },
  test: {
    connection_url: process.env.DATABASE_URL,
    api_key: "99bff15d-d4fe-44dd-a0a3-25f177535450",
    mailer_host: "smtp.sendgrid.net",
    mailer_port: "587",
    mailer_username: "apikey",
    mailer_password: process.env.MAILER_PASSWORD,
    forgotexpiry: 30.00, //mins
    resetdb: false,
    redisURL: process.env.REDIS_URL,
    loginTtl:10.00*60.00,//mins
    jwtKey: process.env.JWT_KEY
  },
  production: {
    connection_url: process.env.DATABASE_URL,
    api_key: process.env.API_KEY,
    mailer_host: "smtp.sendgrid.net",
    mailer_port: "587",
    mailer_username: "apikey",
    mailer_password: process.env.MAILER_PASSWORD,
    forgotexpiry: 30.00, //mins
    resetdb: false,
    redisURL: process.env.REDIS_URL,
    loginTtl:10.00*60.00, //mins
    jwtKey: process.env.JWT_KEY
  }
};
