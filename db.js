const Sequelize = require('sequelize');
const timezone = 'IST'
process.env.TZ = timezone
const connection = new Sequelize('llcdbstagging', 'root', 'pmt11cd3', {
    host: '139.59.15.249',
    dialect: 'mysql',
    options: {
        dialectOptions: {
            timezone
        }
        , timezone
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

module.exports = connection;