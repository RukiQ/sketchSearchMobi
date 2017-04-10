var express = require('express');
var router = express.Router();
var formidable = require('formidable');
// var fs = require('fs');
var cp = require('child_process');

var readline = require('readline');
var fs = require('fs');
var os = require('os');

router.post('/', function(req, res, next) {

    var tmpName = './public/img/tmp.png',
        imgData = req.body.imgData;

    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(tmpName, base64Data, 'base64', function(err) {
        if (err) {
            res.send(err);
        } else {
            // 重开一个进程执行模型查询
            cp.fork(__dirname + '/query.js');

            clearTimeout(timer); // 函数节流
            var timer = setTimeout(showResult, 1500);
        }
    });

    function showResult() {
        var fRead;

        // 遍历目录，找到txt文件
        fs.readdirSync(__dirname).forEach(function(filename) {
            if (filename.lastIndexOf('txt') > 0) {
                fRead = fs.createReadStream(filename);
            }
        });

        var objReadline = readline.createInterface({
            input: fRead
        });

        var index = 1;
        var path = [];

        // 逐行读取txt文件并把图片路径存到数组里
        objReadline.on('line', (line) => {
            var obj = {
                imgPath: line.slice(line.indexOf('public/') + 7, line.lastIndexOf(' ')),
                objPath: line.slice(line.lastIndexOf('public/') + 7)
            }

            if (index < 17) {
                path.push(obj);
                index++;
            }
        });

        // 结束时进行页面渲染
        objReadline.on('close', () => {
            res.send(path);
            res.end();
        });
    }
});

module.exports = router;