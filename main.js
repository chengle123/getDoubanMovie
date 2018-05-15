var https = require('https');
// const http = require('http');
const mysql = require('mysql');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var cheerio = require('cheerio');

// 本地服务======================================================================================

var app = express();
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'app')));
var server = app.listen(9696, function() {
	console.log('Ready');
});

router.post('/getData', function(req, res) {
    console.log('收到',req.body)
    var ops = req.body;
    // var json = startRequest(ops);
    startRequest(ops,res);
    // console.log(json)
    // res.json({
    //     result: json.result,
    //     data: json.data,
    //     msg: json.msg
    // });
})

app.use('/', router);


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
                        labelHtml += '<p>'+ $(this).text() +' '+ text +'</p>';
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