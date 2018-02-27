
var Weibo = require(`${process.cwd()}/routes/weibo.js`);    // require('nodeweibo') also works if you have installed nodeweibo via npm
var setting = require(`${process.cwd()}/config/setting.json`);   // get setting (appKey, appSecret, etc.)
var express = require('express');
var request = require('request');
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    var pic_binary = request
        .get('http://www.baidu.com/img/bd_logo1.png')
        .on('response', function (response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
        })
    var text = req.query.text;
    var statusText = text + " http://www.cddcjt.cn ";
    if (text != null && text != undefined && text != '') {
        Weibo.init(setting);
        var share_para = {
            access_token: "2.00maKMEH0WpgiV209d583bdfRBGWME",
            status: statusText,
            pic: pic_binary //"http://www.baidu.com/img/bd_logo1.png"
        };

        Weibo.Statuses.share(share_para, function (data) {
            console.log(data);
            res.send(data);
        });
    } else {
        res.send("发送内容不能为空,调用格式为：.../weiboServer?text=内容");
    }

});
module.exports = router;
/*
+-------------------------------------------------
(1)注册账号：http://open.weibo.com/
(2)在./setting.json中配置您的开发账号。
(3)搞清楚微博的认证机制即oauth2.0认证原理。
(4)第3点很重要，确保你理解这种开放方式。
+-------------------------------------------------
*/

/*
    initialize weibo before using it
 */
// Weibo.init(setting);


/*
+-------------------------------------------------
例1：开启微博认证
启动认证后，将在浏览器器打开一个窗口，url中含有code参数
注意：运行其中一个例子时，须注释掉另一个例子。
+-------------------------------------------------
*/

// Weibo.authorize();


/*
+--------------------------------------------------
例2：需要获取access_token
(1)阅读微博开放平台API
   如：http://open.weibo.com/wiki/OAuth2/access_token，
   将必要的参数写进jsonParas对象。
(2)在回调中打印出获取的数据
(3)code是您浏览器窗口获得的code。
(4)注意：如运行本例子，请注释掉第1个例子，且code职能调用一次，
        会随着认证不断更新。一个用户一个access_token。
+---------------------------------------------------
*/
// var jsonParas = {
//     // client_id:"468717490",
//     // client_secret:"db8de19e18431e5508f615f83a958afb",
//     code:"e3104edf102c5097df340433efbf9ca7",
//     grant_type:"authorization_code"
// };

// var access_token = Weibo.OAuth2.access_token(jsonParas,function(data){
//     console.log(data);
//     return data.access_token;
// });

/*
    example 3, get public timeline
 */

// set parameters
// var para = {
//     "source": Weibo.appKey.appKey,
//     "access_token": '2.00maKMEH0WpgiV209d583bdfRBGWME'//'2.00VcXgHGULxxYE6484538b020C9B7W'
// };

// get public timeline
// Weibo.Statuses.public_timeline(para, function (data) {
//     console.log(data);
// });

// Weibo.Users.show(para,5610370359,function(data){
//     console.log(data);
// });

// var share_para = {
//     access_token:"2.00maKMEH0WpgiV209d583bdfRBGWME",
//     status:"大家好 http://www.cddcjt.cn ",
//     pic:"http://www.baidu.com/img/bd_logo1.png"
//     // rip:"211.156.0.1"
// }; 

// // var access_token = JSON.stringify("2.00maKMEH0WpgiV209d583bdfRBGWME");
// // var statuses = JSON.stringify(" http%3a%2f%2fcdd.mynatapp.cc+%e8%af%a5%e6%9d%a1%e5%be%ae%e5%8d%9a%e7%94%b1JAVA%e7%a8%8b%e5%ba%8f%e5%8f%91%e9%80%81%ef%bc%8c%e7%9b%ae%e7%9a%84%e6%b5%8b%e8%af%95%e5%85%b6%e5%be%ae%e5%8d%9a%e7%9b%b8%e5%85%b3api%ef%bc%8c%e5%b9%b6%e6%97%a0%e5%ae%9e%e9%99%85%e7%94%a8%e9%80%94%e3%80%82 ");
// // Weibo.Comments.timeline(access_token,function(data){
// //     console.log(data);
// // });
// Weibo.Statuses.share(share_para,function(data){
//     console.log(data);
// });
