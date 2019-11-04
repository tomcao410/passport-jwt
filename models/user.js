

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        userName: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING
        }
    })



    return User;
}
