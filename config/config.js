module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL
  },
  test: {
     connection_url: process.env.DATABASE_URL
  },
  production: {
   connection_url: process.env.DATABASE_URL
  }
};