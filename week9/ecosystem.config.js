module.exports = {
  apps : [{
    name: 'API',
    script: 'sensor.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      AWSRDS_EP: 'candice-chan.czvxvpflre5e.us-east-2.rds.amazonaws.com', // what is this 
      AWSRDS_PW: 'lululala',
      PHOTON_ID: '400030000647373034353237',
      PHOTON_TOKEN: '86b95ab39f88dc00f756ceca20ee59550871f8e9'
    },

    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
