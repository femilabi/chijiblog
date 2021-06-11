module.exports = function (sequelize, DataTypes) {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
      },
      reply_to: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },
      post_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
    },
    {
      tableName: "comments",
    }
  );

  // Model Methods
  Comment.associate = function (models) {
    Comment.belongsTo(models.Post, {
      foreignKey: "post_id",
    });
  };
  return Comment;
};
