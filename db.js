const Sequelize = require('sequelize');
const UserModel = require('./models/user');

// initialize an instance of Sequelize
const sequelize = new Sequelize({
  database: 'users_db',
  username: 'root',
  password: 'mysql41098',
  dialect: 'mysql',
});
// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => console.log('Database connected!'));

module.exports = { User };
