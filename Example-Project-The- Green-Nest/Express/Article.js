module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      articleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT("medium"),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      initialAutoIncrement: 1000,
	  tableName: 'articles',
    }
  );

  Article.associate = function (models) {
    Article.hasMany(models.ArticleDescription, {
      foreignKey: { name: "articleID", allowNull: true },
    });

    Article.hasMany(models.UserEnquiry, {
      foreignKey: { name: "articleID", allowNull: true },
    });
  };

  return Article;
};
