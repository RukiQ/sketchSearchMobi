/*
 * @Author: Ruth
 * @Date:   2017-01-04 10:26:04
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-04-10 14:39:26
 */

'use strict';

define(function(require, exports, module) {
    var Event = require('../common/listener'),
        Global = require('../common/global');

    var ObjDisplayLoad = require('./objDisplay').loadObj;

    // 解决click穿透问题
    /*var FastClick = require('fastclick');
    FastClick.attach(document.body);*/

    function Displayer(info) {
        this.info = info;
        this.init();
    }

    Displayer.prototype = {
        constructor: Displayer,

        initSelectors: function() {
            this.cva = document.getElementById(this.info.layer);
            this.$main = $('.main');
            this.main = document.getElementsByClassName('main')[0];
            this.$wrapper = $('.wrapper');
            this.boxArr = $('.box');
            this.$result = $('.result');
            this.$showObj = $('#show-obj');
            this.container = this.info.container;
            this.$showLinePic = $('.show-line-pic');

            return this;
        },

        /**
         * 初始化模型显示的排列位置
         * @return {[type]} [description]
         */
        initImgPos: function() {
            var gapW = (this.$wrapper.width() + 160) / 4,
                gapH = (this.$wrapper.height() + 160) / 4;

            for (var i = 0; i < 16; i++) {
                if (i > 0 && i < 4) {
                    $(this.boxArr[i]).css({
                        'left': i * gapW + 'px',
                        'top': '0px'
                    })
                }

                if (i > 4 && i < 8) {
                    $(this.boxArr[i]).css({
                        'top': (i % 4) * gapH + 'px',
                        'right': '0px'
                    })
                }

                if (i > 8 && i < 12) {
                    $(this.boxArr[i]).css({
                        'left': (i % 4) * gapW + 'px',
                        'bottom': '0px'
                    })
                }

                if (i > 12 && i < 16) {
                    $(this.boxArr[i]).css({
                        'top': (i % 4) * gapH + 'px',
                        'left': '0px'
                    })
                }
            }
        },

        initEvents: function() {
            this.$result.on('touchstart', 'img', $.proxy(this.touchF, this));
            this.$result.on('touchmove', 'img', $.proxy(this.touchF, this));
            this.$result.on('touchend', 'img', $.proxy(this.touchF, this));
        },

        // 清空底板
        setBasePlate: function(img) {
            this.info.setBasePlate(img);
        },

        /**
         * 监听线画图上的触摸事件
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        touchF: function(event) {
            event.preventDefault(); // 阻止浏览器滚动
            var touch = event.targetTouches[0],
                $img = $(event.target),
                $box = $img.parent();

            switch (event.type) {
                case 'touchstart':
                    this.longTouch = false;
                    this.dragging = false;

                    this._x_start = touch.clientX;
                    this._y_start = touch.clientY;

                    this.left_start = $img.css("left");
                    this.top_start = $img.css("top");

                    this.$tgt = $img.clone(); // 克隆原来的对象
                    this.$tgt.appendTo($img.parent()).css('z-index', 3);

                    var me = this;

                    // 按压展示多视图
                    this.timer = setTimeout(function() {
                        me.longTouch = true;
                    }, 100);

                    break;
                case 'touchmove':
                    this.dragging = true;

                    this._x_move = touch.clientX;
                    this._y_move = touch.clientY;

                    this.$tgt.css({
                        'left': parseFloat(this._x_move) - parseFloat(this._x_start) + "px",
                        'top': parseFloat(this._y_move) - parseFloat(this._y_start) + "px"
                    });

                    // 克隆元素的偏移量
                    this.tgtOffset = this.$tgt.offset();

                    break;
                case 'touchend':
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }

                    this._x_end = event.changedTouches[0].clientX;
                    this._y_end = event.changedTouches[0].clientY;

                    if (this.dragging) { // 如果是移动

                        var tgt_rect = (this.$tgt)[0].getBoundingClientRect();

                        // 当有对象拖入画布时触发查询
                        if (this.intoCanvas(tgt_rect)) {
                            Global.set('status', 'search');
                            this._searchHandler(event.target);
                        }

                        // 当有对象拖入背景框的时候进行容器收集
                        if (this.intoBackground(tgt_rect)) {
                            this.container.add(this.$tgt);
                        }

                    } else if (this.longTouch) { // 长按时显示多线画图
                        this._longTouchHandler(event.target);
                        this.setBorderStyle(event.target, true);

                    } else { // 如果只是点击

                        this.$showLinePic.hide();
                        this.setBorderStyle(event.target, false);

                        // 设置图片大小和底板图像
                        this._tapHandler($box, event.target);
                    }

                    this.$tgt.remove();
                    this.dragging = null;

                    break;
            }
        },

        _searchHandler: function(image) {
            this.setBasePlate(); // 清空底板

            // 触发查询事件
            Event.emit('setCva', image);
        },

        // 点击事件处理函数
        _tapHandler: function($box, img) {
            var isBig = $box.hasClass('big');
            this.setStyle($box, isBig);

            var me = this;

            // 使其它box样式回归原位
            $.each($box.siblings(), function(index, elem) {
                if ($(elem).hasClass('big')) {
                    me.setStyle($(elem), true);
                }
            });

            // 判断是否有大图片
            if (this.noBigImg()) { // 没有大图片
                this.setBasePlate();
                Global.set('status', 'search');
            } else {
                Global.set('status', 'preview');
                this.setBasePlate(img);
            }
        },

        // 长按事件多线画图处理函数
        _longTouchHandler: function(target) {
            var imgList = this.$showLinePic.find('img');
            var src = target.src;
            var folder = src.slice(0, src.lastIndexOf('/') + 1);

            var arr = [];
            arr.push(target.src);
            for (var i = 0; i < 6; i++) {
                arr.push(folder + Math.floor(Math.random() * 101) + '.png');
            }

            var me = this;

            $(imgList).each(function(index, elem) {
                elem.src = arr[index];
            });

            this.$showLinePic.on('click', 'img', function(index, elem) {
                if ($(target).hasClass('blueborder')) {
                    $(target).attr('src', this.src);
                }

                if (Global.get('status') === 'preview') {
                    me.setBasePlate(this);
                }
            });

            // 显示多线画图
            this.$showLinePic.show();
        },

        // 设置图片边框样式
        setBorderStyle: function(target, isLongTouch) {
            if (isLongTouch) {
                $(target).parent().parent().find('img').removeClass('blueborder');
                $(target).addClass('blueborder');
            } else {
                $(target).parent().parent().find('img').removeClass('blueborder');
            }
        },

        // 检查图片展示是否有大图片
        noBigImg: function() {
            var flag = true;

            $.each(this.boxArr, function(index, elem) {
                if ($(elem).hasClass('big')) {
                    flag = false;
                }
            });

            return flag;
        },

        // 设置图片放大和缩小样式
        setStyle: function($box, isBig) {
            var oImg = $box.find('img')[0];

            if (isBig) { // 恢复缩略图
                $box.animate({
                    width: '5rem',
                    height: '5rem'
                }).removeClass('big shadow');
            } else { // 放大
                $box.animate({
                    width: '6rem',
                    height: '6rem'
                }).addClass('big shadow');


                /*ObjDisplayLoad({
                    imgPath: "supply/102_shrec2012png/D00200view/77.png",
                    objPath: "supply/models/D00200.obj"
                });*/
                // $($('#show-obj').find('div')[0]).remove();

                // this.$showObj.show();

                ObjDisplayLoad({
                    imgPath: oImg.src,
                    objPath: $(oImg).data('objPath')
                });
            }
        },

        // 判断是否进入画布
        intoCanvas: function(srcRect) {
            var rect = this.cva.getBoundingClientRect();

            // 上下左右边界判断
            let cL = srcRect.left > rect.left,
                cT = srcRect.top > rect.top,
                cR = srcRect.right < rect.right,
                cB = srcRect.bottom < rect.bottom;

            return cL && cT && cR && cB;
        },

        // 判断是否进入背景
        intoBackground: function(srcRect) {
            var rect = (this.$wrapper)[0].getBoundingClientRect();

            // 上下左右边界判断
            let cL = srcRect.left > rect.left,
                cT = srcRect.top > rect.top,
                cR = srcRect.right < rect.right,
                cB = srcRect.bottom < rect.bottom;

            return !(cL && cT && cR && cB);
        },

        /**
         * 每画一笔进行请求之后的回调，将数据路径赋给图片的src
         * @param  {[array]} data 线画图的路径
         * @return {[type]}      [description]
         */
        queryCb: function(data) {

            for (var i = 0; i < this.boxArr.length; i++) {
                var $box = $(this.boxArr[i]),
                    oImg = $box.find('img')[0],
                    isBig = $box.hasClass('big');

                if (Global.get('status') === 'preview') { // 预览状态
                    if (isBig) {
                        continue;
                    } else {
                        oImg.src = data[i].imgPath;
                        $(oImg).data('objPath', data[i].objPath);
                    }
                } else { // 查询状态
                    oImg.src = data[i].imgPath;
                    $(oImg).data('objPath', data[i].objPath);

                    if (isBig) {
                        this.setStyle($box, isBig);
                    }
                }
            }
        },

        init: function() {
            this.initSelectors().initImgPos();
            this.initEvents();
        }
    }

    module.exports = Displayer;
});