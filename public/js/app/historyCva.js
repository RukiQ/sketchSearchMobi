/*
 * @Author: Ruth
 * @Date:   2017-01-10 14:51:20
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-01-11 20:36:48
 */

'use strict';

define(function(require, exports, module) {
    var Event = require('../common/listener');

    function HistoryCva(info) {
        this.$el = info.el;
        this.init();
    }

    HistoryCva.prototype = {
        constructor: HistoryCva,

        initSelectors: function() {
            this.$imgWrap = this.$el.find('.img-wrap');

            return this;
        },

        initData: function() {
            this.cvaHistory = [];

            return this;
        },

        initEvents: function() {
            var me = this;
            this.$el.on('touchstart', function(e) {
                var $target = $(e.target);
                if ($target.prop('tagName') !== 'IMG') {
                    me.hideHistory();
                } else {
                    Event.emit('history', {
                        'cardId': $target.data('cardid'),
                        'isFromCva': true
                    });
                }
            });
        },

        /**
         * [setHistory description]
         * @param {[array]} cvaHistory 画布卡片历史记录
         */
        setHistory: function(cvaHistory) {
            this.cvaHistory = cvaHistory;

            // 清空div内容
            this.$imgWrap.find('li').remove();

            for (var i = cvaHistory.length - 1; i >= 0; i--) {
                var history = cvaHistory[i].history,
                    len = history.length;

                var $htyObj = $('<li><img class="history-box" data-cardid="' + cvaHistory[i].cardId + '" src="' + history[len - 1].imgSrc + '"/></li>');
                $htyObj.appendTo(this.$imgWrap);
            }
        },

        showHistory: function() {
            this.$el.show();
        },

        hideHistory: function() {
            this.$el.hide();
        },

        init: function() {
            this.initSelectors().initData().initEvents();
        }
    }

    module.exports = HistoryCva;
});