/*
 * @Author: Ruth
 * @Date:   2016-12-25 12:29:02
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-03-31 10:21:19
 */

define(function(require, exports, module) {
    var $ = require('jquery'),
        Painter = require('./painter'),
        BasePlate = require('./basePlate'),
        Displayer = require('./displayer'),
        Container = require('./container'),
        HistoryBar = require('./historyBar'),
        HistoryCva = require('./historyCva'),
        SkecthGallery = require('./sketchGallery'),
        ObjDisplayInit = require('./objDisplay').init;

    function SketchSearch() {
        this.init();
    }

    SketchSearch.prototype = {
        initSelectors: function() {
            this.$body = $('body');
            this.pull = document.getElementById('show-gallery');
            this.$gallery = $('.gallery');
            this.$showObj = $('#show-obj');
            this.objCva = this.$showObj.find('canvas')[0];

            return this;
        },

        initData: function() {

            return this;
        },

        initEvent: function() {
            var me = this;
            this.$body.on('touchstart', function(e) {
                var $target = $(e.target),
                    touch = event.targetTouches[0],
                    yStart = touch.clientY;

                if ($target.prop('tagName') == 'BODY' && yStart > 125) {
                    me.historyBar.toggleBar();
                }
            });

            this.pull.addEventListener('touchstart', $.proxy(this.touchF, this), false);
            this.pull.addEventListener('touchmove', $.proxy(this.touchF, this), false);
            this.pull.addEventListener('touchend', $.proxy(this.touchF, this), false);
            this.objCva.addEventListener('gesturechange', $.proxy(this.gestureF, this), false);
        },

        touchF: function(event) {
            event.preventDefault(); // 阻止浏览器滚动
            var touch = event.targetTouches[0],
                $pull = $(event.target)

            switch (event.type) {
                case 'touchstart':
                    // this._x_start = touch.clientX;
                    this._y_start = touch.clientY;

                    break;
                case 'touchmove':

                    // this._x_move = touch.clientX;
                    this._y_move = touch.clientY;

                    var pullOffset = parseFloat(this._y_move) - parseFloat(this._y_start) - 50;

                    if (pullOffset < 0) {
                        $pull.css({
                            // 'left': parseFloat(this._x_move) - parseFloat(this._x_start) + "px",
                            'top': pullOffset + "px"
                        });
                    }

                    break;
                case 'touchend':
                    $pull.css({
                        'top': "-50px"
                    });

                    if (this.$gallery.css('display') === 'none') {
                        this.$gallery.show();
                    } else {
                        this.$gallery.hide();
                    }

                    break;
            }
        },

        gestureF: function(event) {
            event.preventDefault();

            switch (event.type) {
                case 'gesturestart':

                    break;
                case 'gestureend':


                    break;
                case 'gesturechange':

                    if (event.scale < 1) {
                        this.$showObj.hide();
                    }

                    break;
            }
        },

        init: function() {

            // 底板
            this.basePlate = new BasePlate({
                layer: 'canvas2',
                layerBg: "#fff"
            });

            // 容器
            this.container = new Container({
                el: $('.container')
            });

            // 线画图展示
            this.displayer = new Displayer({
                layer: 'canvas1',
                container: this.container,
                setBasePlate: $.proxy(this.basePlate.setLayer, this.basePlate)
            });

            // 历史记录菜单
            this.historyBar = new HistoryBar({
                el: $('.history-bar')
            });

            // 历史画布记录
            this.historyCva = new HistoryCva({
                el: $('.history-cva')
            })

            // 画布
            this.painter = new Painter({
                layer: 'canvas1',
                layerBg: "#fff",
                historyBar: this.historyBar,
                historyCva: this.historyCva,
                onQuery: $.proxy(this.displayer.queryCb, this.displayer)
            });

            // 模型展示
            ObjDisplayInit();

            this.initSelectors().initEvent();
        }
    }

    var sketchSearch = new SketchSearch();
});