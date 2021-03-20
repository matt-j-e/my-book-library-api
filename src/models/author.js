module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    };

    const AuthorModel = connection.define('Author', schema);
    return AuthorModel;
}