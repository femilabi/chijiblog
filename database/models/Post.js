module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        // allowNull: true,
        // unique: true,
        // defaultValue: 'green'
      },
      category_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      keywords: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      published: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      allow_comments: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      creator: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
    },
    {
      tableName: "posts",
    }
  );

  Post.associate = function (models) {
    Post.belongsTo(models.PostCategory, {
      foreignKey: "category_id",
    });
    Post.hasMany(models.Comment, {
      foreignKey: "post_id",
    });
  };

  return Post;
};
