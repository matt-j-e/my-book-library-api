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

    const GenreModel = connection.define('Genre', schema);
    return GenreModel;
}