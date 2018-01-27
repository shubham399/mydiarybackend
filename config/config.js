module.exports = {
  development: {
    host:"http://uat.mydiaries.cf",
    connection_url: process.env.DATABASE_URL,
    api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450",
    mailer_host: "smtp.sendgrid.net",
    mailer_port:"587",
    mailer_username:"apikey",
    mailer_password:process.env.MAILER_PASSWORD,
    forgotexpiry: 30//mins
  },
  test: {
      host:"http://uat.mydiaries.cf",
     connection_url: process.env.DATABASE_URL,
     api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450",
      mailer_host: "smtp.sendgrid.net",
    mailer_port:"587",
    mailer_username:"apikey",
    mailer_password:process.env.MAILER_PASSWORD,
    forgotexpiry: 1//mins
  },
  production: {
      host:"http://api.mydiaries.cf",
   connection_url: process.env.DATABASE_URL,
   api_key:process.env.API_KEY,
    mailer_host: "smtp.sendgrid.net",
    mailer_port:"587",
    mailer_username:"apikey",
    mailer_password:process.env.MAILER_PASSWORD,
    forgotexpiry: 30//mins
  }
};
