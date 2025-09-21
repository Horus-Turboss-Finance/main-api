module.exports = {
  apps : [{
    name:"main-api",
    script: "./dist/index.js",
    node_args: "--env-file=./production.env",
    instances: 2,
    cron_restart: "0 0 * * *",
    exec_mode: "cluster",
    merge_logs: true,
    increment_var : 'PORT',
  }],
  deploy : {
    production : {
      "user" : "root",
      "host" : "172.252.236.248",
      "key"  : "./keys/id_rsa.pem",   
      "ref"  : "origin/main",
      "repo" : "git@github.com:Horus-Turboss-Finance/main-api.git",
      "path" : "~/cashsight/backend",
      "post-deploy": `npm run preproduction`,
    }
  }
}