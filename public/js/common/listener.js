define(function(require, exports, module) {
    var Event = {
        // 通过 on 接口监听事件 EventName
        // 如果事件 eventName 被触发，则执行 callback 回调函数
        on: function(eventName, callback) {
            if (!this.handles) {
                // this.handles = {};   // 对象引用会引起共享
                Object.defineProperty(this, 'handles', {
                    value: {},
                    enumerable: false,
                    configurable: true,
                    writable: true
                })
            }

            if (!this.handles[eventName]) {
                this.handles[eventName] = [];
            }

            this.handles[eventName].push(callback);
        },

        // 触发事件
        emit: function() {
            var eventName = arguments[0],
                callbackArr = this.handles[eventName],
                args = arguments[1];

            if (callbackArr) {
                for (var i = 0; i < callbackArr.length; i++) {
                    callbackArr[i](args);
                }
            }
        }
    };

    module.exports = Event; 
});