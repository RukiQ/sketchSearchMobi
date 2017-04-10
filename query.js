/*
 * @Author: Ruth
 * @Date:   2016-12-13 09:38:54
 * @Last Modified by:   Ruth
 * @Last Modified time: 2016-12-14 10:16:40
 */

'use strict';
var ffi = require('ffi');

var libm = new ffi.Library(__dirname + '/imagesearcherdll', {
    'Query': [
        'string', ['string', 'string']
    ]
});

var sketchPath = './public/img/tmp.png',
    outputFile = 'result.txt';

libm.Query(sketchPath, outputFile);