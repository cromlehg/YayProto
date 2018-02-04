require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
  }
};
