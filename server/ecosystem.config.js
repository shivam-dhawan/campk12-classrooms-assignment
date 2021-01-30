module.exports = {
  apps: [{
    name: 'API Server',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: ['src',],
    max_memory_restart: '800M',
  }],
};
