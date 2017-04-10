/*
 * @Author: Ruth
 * @Date:   2016-12-30 16:57:11
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-04-10 14:39:35
 */

'use strict';

define(function(require, exports, module) {
    var Event = require('../common/listener'),
        Global = require('../common/global');

    var Painter = function(info) {
        this.info = info;
        this.init();
    }

    Painter.prototype = {
        constructor: Painter,

        initSelectors: function() {
            this.cva = document.getElementById(this.info.layer);
            this.ctx = this.cva.getContext('2d');
            this.boxArr = $('.box');
            this.historyBar = this.info.historyBar;
            this.historyCva = this.info.historyCva;
            this.$clearBtn = $('.clear-btn');
            this.$showObj = $('#show-obj');
            this.$showLinePic = $('.show-line-pic');

            return this;
        },

        initData: function() {
            this.lastX = 0;
            this.lastY = 0;
            this.isPaint = false;
            this.showObjTimer = null;

            this.cvaHistory = []; // 画布卡片历史记录
            this.cvaCnt = 0;

            return this;
        },

        initHistory: function(history) {
            if (history) {
                this.history = history;
                this.count = history.length;
            } else {
                this.history = []; // 绘画历史记录
                this.count = 0;
            }
        },

        setConfig: function() {
            this.config = {
                lineWidth: this.info.lineWidth || 2,
                lineCap: this.info.lineCap || "round",
                boardW: this.cva.cvaWidth || 500,
                boardH: this.cva.cvaHeight || 350,
                layerBg: this.info.layerBg || "#fff"
            };

            return this;
        },

        setWH: function() {
            this.cva.setAttribute('width', this.config.boardW);
            this.cva.setAttribute('height', this.config.boardH);
            return this;
        },

        // 为刚开始绘画设置画板
        setLayer: function() {

            // 设置全局透明度为0.7，这样下层的canvas才会显示出来
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillStyle = this.config.layerBg;
            this.ctx.fillRect(0, 0, this.config.boardW, this.config.boardH);

            return this;
        },

        // 清除图层，如果不清除，会叠加显示，导致不透明
        clearLayer: function() {
            this.ctx.clearRect(0, 0, this.config.boardW, this.config.boardH);

            return this;
        },

        setPen: function() {
            this.ctx.lineJoin = this.config.lineJoin;
            this.ctx.strokeStyle = this.config.strokeStyle;
            return this;
        },

        initEvents: function() {
            this.cva.addEventListener('touchstart', this.touchF.bind(this), false);
            this.cva.addEventListener('touchmove', this.touchF.bind(this), false);
            this.cva.addEventListener('touchend', this.touchF.bind(this), false);
            this.cva.addEventListener('touchenter', this.touchF.bind(this), false);

            this.cva.addEventListener('gesturestart', this.gestureF.bind(this), false);
            this.cva.addEventListener('gestureend', this.gestureF.bind(this), false);
            this.cva.addEventListener('gesturechange', this.gestureF.bind(this), false);

            var me = this;

            // 订阅查询事件
            Event.on('setCva', function(image) {
                if (image) {
                    me.drawResult(image);
                } else {
                    me.searchModel();
                }
            });

            Event.on('history', function(options) {
                var cardId = options.cardId,
                    history = me.cvaHistory[cardId].history;

                // 来自画布卡片历史记录
                if (options.isFromCva) {
                    var drawId = history.length - 1;

                    me.drawHistory(history, drawId);
                    me.historyBar.setHistory(history);
                    me.initHistory(history);
                    me.cvaCnt = cardId;

                } else { // 来自各自的历史记录
                    var drawId = options.drawId;
                    me.drawHistory(history, drawId);
                    // console.log(22)
                }
            });

            var me = this;
            this.$clearBtn.on('click', function() {
                me.clearLayer().setLayer();
                me.cvaHistoryLog();
                me.initHistory();
                me.historyCva.showHistory();
                // console.log(me.cvaHistory);
            });
        },

        // 每一张卡片上绘画的历史记录
        historyLog: function() {
            this.history[this.count] = {
                imgData: this.ctx.getImageData(0, 0, this.config.boardW, this.config.boardH),
                imgSrc: this.cva.toDataURL('image/png'),
                cardId: this.cvaCnt,
                drawId: this.count
            };
            this.count++;

            this.cvaHistory[this.cvaCnt] = {
                cardId: this.cvaCnt,
                history: this.history.slice(0)
            };

            this.historyBar.setHistory(this.history);
            this.historyCva.setHistory(this.cvaHistory);
        },

        // 画布卡片历史记录
        cvaHistoryLog: function() {
            if (this.history.length) {
                this.cvaCnt++;
            }
        },

        // 触摸事件处理函数
        touchF: function(event) {
            event.preventDefault();
            var point = event.changedTouches[0];
            var touches = event.touches; // 有多少个触摸对象
            var me = this;

            var rect = this.cva.getBoundingClientRect();

            switch (event.type) {
                case 'touchstart':
                    this.draw(point.clientX - rect.left, point.clientY - rect.top);

                    // 3个手指清空画布，即重新生成一张画布卡片
                    if (touches.length == 3) {
                        me.clearLayer().setLayer();
                        me.cvaHistoryLog();
                        me.initHistory();
                    }

                    if (touches.length == 1) {
                        // 按压操作实现模型展示
                        this.timer = setTimeout(function() {
                            me.$showObj.show();
                        }, 500);
                    }

                    break;
                case 'touchmove':
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }

                    if (touches.length == 1) {
                        this.isPaint = true;
                    }

                    if (this.isPaint && !this.gesture) {
                        this.draw(point.clientX - rect.left, point.clientY - rect.top);
                    }
                    break;
                case 'touchend':
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }

                    if (this.$showLinePic.css('display')) {
                        this.$showLinePic.hide();
                        $('.box').each(function(index, elem) {
                            $($(elem).find('img')).removeClass('blueborder');
                        });
                    }

                    if (this.isPaint) {
                        this.historyLog();
                    }
                    this.isPaint = false;
                    this.searchModel();

                    break;
                case 'touchenter':
                    // console.log('touch enter');
                    break;
                default:
                    this.isPaint = false;
                    break;
            }
        },

        // 手势事件处理函数
        gestureF: function(event) {
            this.isPaint = false;
            var me = this;

            switch (event.type) {
                case 'gesturestart':
                    this.gesture = true;

                    break;
                case 'gestureend':
                    this.gesture = false;

                    break;
                case 'gesturechange':
                    this.gesture = true;
                    // alert(event.scale);

                    // 放大的手势时，显示画布卡片历史记录
                    if (event.scale > 1) {
                        this.ctx.restore();
                        this.historyCva.showHistory();
                    }

                    // 缩小的手势时，展示当前选中的模型
                    /*if (event.scale < 1) {
                        this.$showObj.show();
                    }*/

                    break;
            }
        },

        // 当图片拖入canvas时触发查询
        drawResult: function(image) {
            /*var image = new Image();
            image.src = 'img/traindata/54.png';*/

            // 清除图层
            this.clearLayer();

            // 将选中的线画图画到画板中
            this.ctx.drawImage(image, 0, 0, this.config.boardW, this.config.boardH);
            this.historyLog();
            this.searchModel();
        },

        // 绘制历史记录的图片
        drawHistory: function(history, drawId) {
            var len = history.length,
                imgData = history[drawId].imgData;

            this.ctx.putImageData(imgData, 0, 0);
            this.historyCva.hideHistory();
            this.searchModel();
        },

        draw: function(x, y) {
            if (this.isPaint) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }

            // 当 'touchstart' 时，先移动到触摸点
            this.lastX = x;
            this.lastY = y;
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

        searchModel: function() {
            var imgData = this.cva.toDataURL('image/png');
            var me = this;

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: {
                    imgData: imgData
                },
                success: function(data) {
                    me.info.onQuery(data);
                }
            });
        },

        bind: function(obj, handler) {
            return function() {
                return handler.apply(obj, arguments);
            };
        },

        init: function() {
            this.initSelectors().initData().initHistory();
            this.setConfig().setWH().setLayer().setPen();
            this.initEvents();
        }
    }

    module.exports = Painter;
});