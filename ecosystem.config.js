module.exports = {
  apps : [{
    name   : "gateway",
    script : "./gateway.js",
    env: {
      NODE_ENV: "production"
   }
  }]
}
