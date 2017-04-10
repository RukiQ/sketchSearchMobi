/*
 * @Author: Ruth
 * @Date:   2017-01-10 10:55:40
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-01-11 20:59:42
 */

'use strict';

define(function(require, exports, module) {
    var Event = require('../common/listener');

    function HistoryBar(info) {
        this.$el = info.el;
        this.init();
    }

    HistoryBar.prototype = {
        constructor: HistoryBar,

        initSelectors: function() {
            this.$imgWrap = this.$el.find('.img-wrap');

            return this;
        },

        initEvents: function() {
            var me = this;
            this.$el.on('touchstart', 'img', function(e) {
                var $target = $(e.target);

                Event.emit('history', {
                    'cardId': $target.data('cardid'),
                    'drawId': $target.data('drawid'),
                    'isFromCva': false
                });
            });
        },

        toggleBar: function() {
            this.$el.toggle();
        },

        setHistory: function(history) {

            // 清空div内容
            this.$imgWrap.find('li').remove();

            /*for (var i = 0; i < history.length; i++) {
                var img = history[i].imgSrc,
                    $htyObj = $('<li><img class="history-box" src="' + img + '"/></li>'),
                    childArr = this.$imgWrap.find('li');

                if (childArr.length) {
                    $htyObj.insertBefore(childArr[0]);
                } else {
                    $htyObj.appendTo(this.$imgWrap);
                }
            }*/
            for (var i = history.length - 1; i >= 0; i--) {
                var $htyObj = $('<li><img class="history-box" data-cardid="' + history[i].cardId + '" data-drawId="' + history[i].drawId + '" src="' + history[i].imgSrc + '"/></li>');
                $htyObj.appendTo(this.$imgWrap);
            }
        },

        init: function() {
            this.initSelectors().initEvents();
        }
    }

    module.exports = HistoryBar;
});