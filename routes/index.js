var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });//返回信息
  res.sendfile(`${process.cwd()}/public/html/index.html`);//返回页面
});

// router.get('/weibo', function (req, res, next) {
//   // res.render('index', { title: '微博发布服务测试' });
//   const user = {
//     'username':req.query.username,
//     'password':req.query.password
//   }
//   console.log(user);
// });

module.exports = router;
