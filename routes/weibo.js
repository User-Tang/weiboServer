var open = require('open'),
  https = require('https'),
  querystring = require('querystring'),
  request = require('request'),
  fs = require('fs');
urlconfig = require(`${process.cwd()}/config/config.json`);

var Weibo = {};

//Weito添加类  
(function () {
  var paras = urlconfig;

  // must initialize before using Weibo Object
  Weibo.init = function (setting) {
    Weibo.appKey = {
      "appKey": setting.appKey,
      "appSecret": setting.appSecret,
      "redirectUrl": setting.redirectUrl
    };
  };

  Weibo.getGetURL = function (paras) {
    var arr = [];
    for (var key in paras) {
      arr.push(key + '=' + paras[key]);
    }
    var path = '?client_id=' + Weibo.appKey.appKey + '&redirect_uri=' + Weibo.appKey.redirectUrl
      + '&client_secret=' + Weibo.appKey.appSecret;
    if (arr)
      return path + '&' + arr.join('&');
    return path + arr.join('&');
  };

  Weibo.getPostURL = function (paras) {
    if (!paras)
      paras = {};
    paras.client_id = Weibo.appKey.appKey;
    paras.redirect_uri = Weibo.appKey.redirectUrl;
    paras.client_secret = Weibo.appKey.appSecret;
    return paras;
  };

  Weibo.authorize = function () {
    var path = 'https://api.weibo.com/oauth2/authorize' + Weibo.getGetURL();
    open(path);
  };

  for (var name in urlconfig) {
    var funcBody = urlconfig[name];
    Weibo[name] = {};
    for (var index in funcBody) {
      //Weibo命名空间下的类添加静态函数
      Weibo[name][funcBody[index].func] = createFunc(funcBody[index]);
    }
  }

  function createFunc(urlParas) {
    return function (pJson, callback) {
      var options = {};
      var post_data = '';
      options.hostname = urlParas.host.replace('https://', '');
      options.port = 443;
      options.path = urlParas.path;

      if (urlParas.rmethod[0] === 'GET') {
        options.path = options.path + Weibo.getGetURL(arguments[0]);
        options.method = 'GET';
      } else {
        options.method = 'POST';
        options.rejectUnauthorized = false;
        var jsonAgrs = Weibo.getPostURL(arguments[0]);
        post_data = querystring.stringify(jsonAgrs);
        if (pJson.pic != undefined) {
          var picurl = pJson.pic.slice(0, pJson.pic.length - 1).split(";");
          for (var i in picurl) {
            var index = picurl[i].lastIndexOf("\/");
            var str = picurl[i].substring(index + 1, picurl[i].length);
            var fileurl = `${process.cwd()}/public/images/` + str;
            downloadFile(picurl[i], fileurl, function () {
              /**
             * 发送图文
             */
              if (picurl) {
                request.post({
                  url: "https://" + options.hostname + options.path, formData: {
                    pic: fs.createReadStream(`${process.cwd()}/public/images/` + str),
                    access_token: pJson.access_token,
                    status: pJson.status
                  }
                }, function optionalCallback(err, httpResponse, body) {
                  if (err) {
                    return console.error('上传图片到微博:', err);
                  }
                  console.log('上传图片到微博，微博返回:', body);
                });
                return;
              }

            });
          }
        }
        /**
        * 发送文字
        */
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',//'application/x-www-form-urlencoded',multipart/form-data 
          'Content-Length': post_data.length
        };
      }

      var req = https.request(options, function (res) {
        var full_data = "";
        res.on('data', function (data) {
          full_data += data;
        });

        res.on('end', function () {
          var buf = new Buffer(full_data);
          var jsonData = {};
          if (buf) {
            try {
              var jsonData = JSON.parse(buf);
            } catch (e) {
              console.log('服务器请求数据失败');
            }
          }
          callback(jsonData);
        });
      });

      req.end(post_data);
      req.on('error', function (e) {
        console.error(e);
      });
    };
  }
})();

function downloadFile(uri, filename, callback) {
  var stream = fs.createWriteStream(filename);
  request(uri).pipe(stream).on('close', callback);
}

module.exports = Weibo;