module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING
        }
    })

    User.sync()
    .then(() => console.log('Oh yeah! User table created successfully'))
    .catch(err => console.log('BTW, did you enter wrong database credentials?'));

    return User;
}
