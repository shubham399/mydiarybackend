module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL,
    api_key:"somekey"
  },
  test: {
     connection_url: process.env.DATABASE_URL,
     api_key:"somekey"
  },
  production: {
   connection_url: process.env.HEROKU_POSTGRESQL_PUCE_URL,
   api_key:process.env.API_KEY
  }
};