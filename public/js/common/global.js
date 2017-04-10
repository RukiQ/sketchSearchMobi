/*
 * @Author: Ruth
 * @Date:   2017-01-05 20:32:42
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-01-11 20:59:37
 */

'use strict';

define(function(require, exports, module) {
    var data = {
        status: 'search'
    }

    module.exports.get = function(key) {
        return data[key];
    }

    module.exports.set = function(key, value) {
        data[key] = value;
    }
});