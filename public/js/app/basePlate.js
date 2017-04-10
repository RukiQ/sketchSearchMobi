/*
 * @Author: Ruth
 * @Date:   2017-01-05 14:57:52
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-01-11 16:46:41
 */

'use strict';

define(function(require, exports, module) {
    function BasePlate(info) {
        this.info = info;
        this.init();
    }

    BasePlate.prototype = {
        constructor: BasePlate,

        initSelectors: function() {
            this.cva = document.getElementById(this.info.layer);
            this.ctx = this.cva.getContext('2d');

            return this;
        },

        setConfig: function() {
            this.config = {
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

        setLayer: function(image) {
            if (image) { // 显示图片
                this.drawResult(image);
            } else { // 设置空画板
                this.ctx.fillStyle = this.config.layerBg;
                this.ctx.fillRect(0, 0, this.config.boardW, this.config.boardH);
            }

            return this;
        },

        drawResult: function(image) {

            // 当图片点击放大，并没有进入canvas时只显示半透明层
            this.ctx.drawImage(image, 0, 0, this.config.boardW, this.config.boardH);
        },

        init: function() {
            this.initSelectors();
            this.setConfig().setWH().setLayer();
        }
    }

    module.exports = BasePlate;
});