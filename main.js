var https = require('https');
// const http = require('http');
const mysql = require('mysql');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const zbp_category = require('./models/zbp_category');
const zbp_post = require('./models/zbp_post');
const zbp_tag = require('./models/zbp_tag');
const zbp_module = require('./models/zbp_module');

var cheerio = require('cheerio');

// 本地服务======================================================================================

var app = express();
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'app')));
var server = app.listen(9696, function() {
	console.log('Ready');
});

router.post('/setDB', function(req, res) {
    var tagData = JSON.parse(req.body.tag);
    try{
		zbp_post.create({
            log_CateID: req.body.category,
            log_AuthorID: 1,
            log_Tag: req.body.tagText,
            log_Title: req.body.title,
            log_Intro: req.body.htmlText,
            log_Content: req.body.html,
            log_PostTime: req.body.time
        }).then(function(rows){
            res.json({
                result: 'success',
                data: '',
                msg: '数据插入成功'
            })

            try{
                zbp_category.find({where:{cate_ID:req.body.category}}).then(function(rows){
                    var cate_Count = rows.cate_Count+1;
                    try{
                        zbp_category.update({cate_Count:cate_Count},{where:{cate_ID:req.body.category}}).then(function(rows){
                            console.log('修改分类成功');
                        })
                    }catch(e) {
                        console.log('修改分类失败');
                    }
                })
            }catch(e) {
                console.log('查询分类失败');
            }
            
            try{
                zbp_module.find({where:{mod_ID:'8'}}).then(function(rows){
                    var mod_ContentA = rows.mod_Content.split('\r\n');
                    var num = parseInt(mod_ContentA[0].split(':')[1]);
                    mod_ContentA[0] = '<li>文章总数:'+(num+1)+'</li>';
                    try{
                        zbp_module.update({mod_Content: mod_ContentA.join("\r\n")},{where:{mod_ID:8}}).then(function(rows){
                            console.log('修改站点信息成功');
                        })
                    }catch(e) {
                        console.log('修改站点信息失败');
                    }
                })
            }catch(e) {
                console.log('查询站点信息失败');
            }

            for(var i=0;i<tagData.length;i++){
                updateTag(tagData[i]);
            }
		})
	}catch(e) {
        res.json({
            result: 'error',
            data: '',
            msg: '数据插入失败'
        })
        console.log('数据插入失败');
	}
})

router.post('/getData', function(req, res) {
    console.log('收到',req.body);
    startRequest(req.body,res);
})

app.use('/', router);

function updateTag(id){
    try{
        zbp_tag.find({where:{tag_ID: id}}).then(function(rows){
            var tag_Count = rows.tag_Count+1;
            try{
                zbp_tag.update({tag_Count: tag_Count},{where:{tag_ID: id}}).then(function(rows){
                    console.log('修改标签成功');
                })
            }catch(e) {
                console.log('修改标签失败');
            }
        })
    }catch(e) {
        console.log('查询标签失败');
    }
}


// 爬虫======================================================================================
function startRequest(ops,resJson){
	https.get('https://movie.douban.com/subject/' + ops.id + '/', function (res) {

		var html = '';        //用来存储请求网页的整个html内容
		var titles = [];        
		res.setEncoding('utf-8'); //防止中文乱码
		//监听data事件，每次取一块数据
		res.on('data', function (chunk) {
			html += chunk;
		});
		//监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
		res.on('end', function () {
			var labelHtml = ''
			var $ = cheerio.load(html,{decodeEntities: false}); //采用cheerio模块解析html

            try{
                var img = $('#mainpic img').attr('src');
                if(img.indexOf("movie_poster_cover")!=-1){
                    img = img.replace('movie_poster_cover/lpst','photo/photo').replace('https','http');
                }
                
                labelHtml += '<p><img src="'+img+'"></p>';
                labelHtml += '<p>豆瓣评分:'+$('#interest_sectl .rating_num').text()+'</p>';
                var a = $('#info > span');
                a.each(function(){
                    if($(this).text() == '类型:'){
                        return false;
                    }else{
                        labelHtml += '<p>'+ $(this).text() +'</p>';
                    }
                })

                var c = $('#info > span[property="v:genre"]');
                var d = $('#info > span[property="v:initialReleaseDate"]');
                var e = $('#info > a');
                var text = ''
                c.each(function(i){
                    if(i == c.length-1){
                        text += $(this).text();
                    }else{
                        text += $(this).text()+'/';
                    }
                })

                var b = $('#info > .pl');
                b.each(function(){
                    if($(this).text() == '类型:'){
                        labelHtml += '<p id="returnTag">'+ $(this).text() +' '+ text +'</p>';
                    }else if($(this).next().text()){
                        labelHtml += '<p>'+ $(this).text() +' '+ $(this).next().text() +'</p>';
                    }else{
                        labelHtml += '<p>'+ $(this).text() +' '+ $(this).next()[0].prev.data +'</p>';
                    }
                })

                labelHtml += '<p>'+$('title').text()+'的剧情简介:</p>'
                            +'<p>'+$('#link-report > span').text()+'</p>'

                labelHtml += '<p>'
                            +'<span style="font-size: 16px;">百度云下载链接：</span>'
                            +'</p><p>'
                            +'<a href="'+ops.url+'" target="_blank" title="'+$('#content > h1').text()+'" style="font-size: 16px; text-decoration: underline;"><span style="font-size: 16px;">'+ops.url+'</span></a>'
                            +'</p>'
                            +'<p>'
                            +'<a href="'+ops.url+'" target="_blank" title="'+$('#content > h1').text()+'" style="font-size: 16px; text-decoration: underline;"><span style="font-size: 16px;">密码：'+ops.pasword+'</span></a>'
                            +'</p>';
                resJson.json({
                    result: 'success',
                    data: labelHtml,
                    msg: '采集成功'
                })
                        
            }catch(e) {
                resJson.json({
                    result: 'error',
                    data: '',
                    msg: '采集失败'
                })
            }
		});

	}).on('error', function (err) {
		console.log(err);
        resJson.json({
            result: 'error',
            data: '',
            msg: '采集失败'
        })
	});
}