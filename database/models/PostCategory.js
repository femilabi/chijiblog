module.exports = function (sequelize, DataTypes) {
  const PostCategory = sequelize.define(
    "PostCategory",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
      },
      parent_id: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      keywords: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "post_categories",
    }
  );

  // Model Methods
  PostCategory.associate = function (models) {
    PostCategory.hasMany(models.Post, {
      foreignKey: "category_id",
    });
  };
  return PostCategory;
};
