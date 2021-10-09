const video = (sequelize, DataTypes) => {
    const Video = sequelize.define('video', {
        url: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Video;
};

export default video;