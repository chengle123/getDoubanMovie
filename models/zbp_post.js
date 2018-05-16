const Sequelize= require('sequelize');
var seq = require('./config.js').seq;

var zbp_post = seq.define('zbp_post', {
    log_ID: {
        autoIncrement:true,
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        comment: "编码 自增值且是主键"
    },
    log_CateID:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    log_AuthorID:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_Tag:{
        type: Sequelize.STRING,
        allowNull:true
    },
    log_Status:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_Type:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_Alias:{
        type: Sequelize.STRING,
        allowNull:true
    },
    log_IsTop:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_IsLock:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_Title:{
        type: Sequelize.STRING,
        allowNull:true
    },
    log_Intro:{
        type: Sequelize.STRING,
        allowNull:true
    },
    log_Content:{
        type: Sequelize.STRING,
        allowNull:true
    },
    log_PostTime:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_CommNums:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_ViewNums:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    log_Template:{
        type: Sequelize.STRING,
        allowNull:true
    },
    log_Meta:{
        type: Sequelize.STRING,
        allowNull:true
    },
}, {
    freezeTableName: true, // Model 对应的表名将与model名相同,
    timestamps: false
});

module.exports = zbp_post;