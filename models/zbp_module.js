const Sequelize= require('sequelize');
var seq = require('./config.js').seq;

var zbp_module = seq.define('zbp_module', {
    mod_ID: {
        autoIncrement:true,
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        comment: "编码 自增值且是主键"
    },
    mod_Name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    mod_FileName:{
        type: Sequelize.STRING,
        allowNull:true
    },
    mod_Content:{
        type: Sequelize.STRING,
        allowNull:true
    },
    mod_SidebarID:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    mod_HtmlID:{
        type: Sequelize.STRING,
        allowNull:true
    },
    mod_Type:{
        type: Sequelize.STRING,
        allowNull:true
    },
    mod_MaxLi:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    mod_Source:{
        type: Sequelize.STRING,
        allowNull:true
    },
    mod_IsHideTitle:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    mod_Meta:{
        type: Sequelize.STRING,
        allowNull:true
    },
}, {
    freezeTableName: true, // Model 对应的表名将与model名相同,
    timestamps: false
});

module.exports = zbp_module;