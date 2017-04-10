/*
 * @Author: Ruth
 * @Date:   2017-01-04 10:51:45
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-03-18 11:48:48
 */

'use strict';

define(function(require, exports, module) {
    function Container(info) {
        this.$el = info.el;
        this.init();
    }

    Container.prototype = {
        constructor: Container,

        initSelectors: function() {
            this.imgGather = this.$el.find('img')[0];

            return this;
        },

        initData: function() {
            this.gatherObj = ['img/search-icon.png'];
            this.show = false;

            return this;
        },

        initEvents: function() {
            this.$el.on('touchstart', this.imgGather, $.proxy(this.touchF, this));
            this.$el.on('touchend', this.imgGather, $.proxy(this.touchF, this));
        },

        touchF: function(event) {
            event.preventDefault();
            var touches = event.touches;
            var $target = $(event.target);
            var me = this;

            switch (event.type) {
                case 'touchstart':

                    if ($target.parent().css('opacity') != 0.1) {
                        this.timer = setTimeout(function() {
                            $('.loading').show();
                            me.show = !me.show;
                        }, 1500);
                    }

                    break;
                case 'touchend':
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }

                    this.show = !this.show;
                    this.toggleData(this.show);

                    break;
            }
        },

        add: function($img) {
            this.imgGather.src = $img.prop('src');
            this.gatherObj.push($img.prop('src'));
            this.$el.css({
                'opacity': '0.8'
            });

            if (this.show) {
                this.show = false;
                this.toggleData(false);
            }
        },

        toggleData: function(isShow) {
            if (isShow) { // 显示
                this.$el.not('.img-gather').empty(); // 不清空已有的图片
                for (var i = 0, len = this.gatherObj.length; i < len; i++) {
                    var img = new Image();
                    img.src = this.gatherObj[i];
                    img.className = 'img-gather';
                    this.$el.append(img);
                }
            } else { // 隐藏
                this.$el.empty();
                var img = new Image();
                img.src = this.gatherObj[this.gatherObj.length - 1];
                img.className = 'img-gather';
                this.$el.append(img);
            }
        },

        init: function() {
            this.initSelectors().initData().initEvents();
        }
    }

    module.exports = Container;
});