var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var fs = require('fs');
var cp = require('child_process');

var readline = require('readline');
var fs = require('fs');
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
    showResult();

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
            var imgPath = line.slice(line.indexOf('public/') + 7, line.lastIndexOf(' '));

            if (index < 17) {
                path.push(imgPath);
                index++;
            }
        });

        // 结束时进行页面渲染
        objReadline.on('close', () => {
            res.render('index', {
                path: path
            });

            res.end();
        });
    }
});

module.exports = router;