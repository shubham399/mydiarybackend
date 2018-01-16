module.exports = {
  development: {
    connection_url: process.env.DATABASE_URL,
    api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450"
  },
  test: {
     connection_url: process.env.DATABASE_URL,
     api_key:"99bff15d-d4fe-44dd-a0a3-25f177535450"
  },
  production: {
   connection_url: process.env.DATABASE_URL,
   api_key:process.env.API_KEY
  }
};
