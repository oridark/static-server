var express = require('express');
var crypto = require('crypto'); //引入加密模块
var port = process.env.PORT || 9898;
var compression = require('compression');
var config = require('./config'); //引入配置文件
var app = express();

app.use(compression());
app.use(require('connect-history-api-fallback')());
app.use(express.static(__dirname+'/dist'));
//用于处理所有进入 3000 端口 get 的连接请求
app.get('/wx', function (req, res) {
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature,//微信加密签名
        timestamp = req.query.timestamp,//时间戳
        nonce = req.query.nonce,//随机数
        echostr = req.query.echostr;//随机字符串
    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [config.token, timestamp, nonce];
    array.sort();
    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    var hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        res.send(echostr);
    } else {
        res.send('mismatch');
    }
});
app.listen(port, '0.0.0.0', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('运行中');
});
