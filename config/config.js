module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL,
    api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450",
    mailer_host: "smtp.sendgrid.net",
    mailer_port:"587",
    mailer_username:"apikey",
    mailer_password:process.env.MAILER_PASSWORD,
  },
  test: {
     connection_url: process.env.DATABASE_URL,
     api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450",
      mailer_host: "smtp.sendgrid.net",
    mailer_port:"587",
    mailer_username:"apikey",
    mailer_password:process.env.MAILER_PASSWORD,
  },
  production: {
   connection_url: process.env.DATABASE_URL,
   api_key:process.env.API_KEY,
    mailer_host: "smtp.sendgrid.net",
    mailer_port:"587",
    mailer_username:"apikey",
    mailer_password:process.env.MAILER_PASSWORD,
  }
};
