var http = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var process = require('process');

var id = process.argv[2];
var url = 'https://movie.douban.com/subject/';
var json = [];

function fetchPage(x) {     //封装了一层函数
    startRequest(x); 
}

function startRequest(x){
	console.log(x)
	http.get(x, function (res) {

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
			// console.log($('#info ').nextSibling)
			b.each(function(){
				// if($(this).text() == '类型:'){
				// 	labelHtml += '<p>'+ $(this).text()+text +'</p>';
				// }else if($(this).text() == '首播:'){
				// 	labelHtml += '<p>'+ $(this).text()+d.text() +'</p>';
				// }else if($(this).text() == 'IMDb链接:'){
				// 	labelHtml += '<p>'+ $(this).text()+e.text() +'</p>';
				// }else{
				// 	labelHtml += '<p>'+ $(this).text() + $(this).next()[0].prev.data +'</p>';
				// }
				if($(this).text() == '类型:'){
					labelHtml += '<p>'+ $(this).text() +' '+ text +'</p>';
				}else if($(this).next().text()){
					labelHtml += '<p>'+ $(this).text() +' '+ $(this).next().text() +'</p>';
				}else{
					labelHtml += '<p>'+ $(this).text() +' '+ $(this).next()[0].prev.data +'</p>';
				}
				// labelHtml += '<p>'+ $(this).text() +'</p>';
				
			})

			labelHtml += '<p>'+$('title').text()+'的剧情简介:</p>'
						+'<p>'+$('#link-report > span').text()+'</p>'

			labelHtml += '<p>'
						 +'<span style="font-size: 16px;">百度云下载链接：</span>'
						 +'</p><p>'
						 +'<a href="https://pan.baidu.com/s/1kVKAcqN" target="_blank" title="'+$('#content > h1').text()+'" style="font-size: 16px; text-decoration: underline;"><span style="font-size: 16px;">https://pan.baidu.com/s/1kVKAcqN</span></a>'
						 +'</p>'
						 +'<p>'
						 +'<a href="https://pan.baidu.com/s/1kVKAcqN" target="_blank" title="'+$('#content > h1').text()+'" style="font-size: 16px; text-decoration: underline;"><span style="font-size: 16px;">密码：hkoj</span></a>'
						 +'</p>';

			var title = './资源.text' //'./'+$('title').text().replace(/\ +/g,"").replace(/[\r\n]/g,"")+'.text';
			console.log($('title').text())
			writeFile(title,labelHtml);
			
		});

	}).on('error', function (err) {
		console.log(err);
	});
}
fetchPage(url+id+'/');

// 生成文件
function writeFile(fileName,data)
{  console.log(fileName,data)
  fs.writeFile(fileName,data,'utf-8',complete);
  function complete(err)
  {
      if(!err)
      {
          console.log("文件生成成功");
      }else{
      	console.log("文件生成失败");
      }
  } 
}