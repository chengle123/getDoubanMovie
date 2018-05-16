const Sequelize= require('sequelize');
var seq = require('./config.js').seq;

var zbp_tag = seq.define('zbp_tag', {
    tag_ID: {
        autoIncrement:true,
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        comment: "编码 自增值且是主键"
    },
    tag_Name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tag_Order:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    tag_Count:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    tag_Alias:{
        type: Sequelize.STRING,
        allowNull:true
    },
    tag_Intro:{
        type: Sequelize.STRING,
        allowNull:true
    },
    tag_Template:{
        type: Sequelize.STRING,
        allowNull:true
    },
    tag_Meta:{
        type: Sequelize.STRING,
        allowNull:true
    },
}, {
    freezeTableName: true, // Model 对应的表名将与model名相同,
    timestamps: false
});

module.exports = zbp_tag;