const Sequelize= require('sequelize');
var seq = require('./config.js').seq;

var zbp_category = seq.define('zbp_category', {
    cate_ID: {
        autoIncrement:true,
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        comment: "编码 自增值且是主键"
    },
    cate_Name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cate_Order:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    cate_Count:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    cate_Alias:{
        type: Sequelize.STRING,
        allowNull:true
    },
    cate_Intro:{
        type: Sequelize.STRING,
        allowNull:true
    },
    cate_RootID:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    cate_ParentID:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    cate_Template:{
        type: Sequelize.STRING,
        allowNull:true
    },
    cate_LogTemplate:{
        type: Sequelize.STRING,
        allowNull:true
    },
    cate_Meta:{
        type: Sequelize.STRING,
        allowNull:true
    },
}, {
    freezeTableName: true, // Model 对应的表名将与model名相同,
    timestamps: false
});

module.exports = zbp_category;