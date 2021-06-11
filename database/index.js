const { Sequelize, DataTypes } = require("sequelize");
const glob = require("glob");
const path = require("path");

const { config } = require("../utils/mainUtils");

const sequelize = new Sequelize(config("db_conf.name"), config("db_conf.username"), config("db_conf.password"), {
    host: config("db_conf.host"),
    dialect: config("db_conf.dialect"),
    hooks: {
        beforeDefine: function (columns, model) {
            model.tableName = config("db_conf.prefix") + model.tableName;
        }
    }
});

const models = {};

glob.sync("./database/models/*.js").forEach(function (file) {
    let model_name = path.parse(file)["name"];
    models[model_name] = require(path.resolve(file))(sequelize, DataTypes);
});

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.sync({ alter: true });

module.exports = {
    models,
    sequelize
};