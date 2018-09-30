(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UrlParams = (function () {
        function UrlParams() {
        }
        UrlParams.prototype.getParam = function (name) {
            return this.getParams()[name];
        };
        UrlParams.prototype.getParams = function () {
            if (this._params) {
                return this._params;
            }
            var params = {};
            window.location.href.replace(/[?&]+(\w+)([^&]*)/gi, function (m, key) {
                params[key] = true;
                return '';
            });
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                params[key] = decodeURIComponent(value);
                return '';
            });
            this._params = params;
            return params;
        };
        UrlParams.prototype.setParam = function (name, value) {
            if (value) {
                var search = void 0;
                var urlComponent = encodeURIComponent(value);
                var existUrlParam = this.getParam(name);
                if (existUrlParam) {
                    search = location.search.replace(new RegExp('([?|&]' + name + '=)' + '(.+?)(&|$)'), '$1' + urlComponent + '$3');
                }
                else if (location.search.length) {
                    search = location.search + '&' + name + '=' + urlComponent;
                }
                else {
                    search = '?' + name + '=' + urlComponent;
                }
                var params = {};
                params[name] = value;
                this._params[name] = value;
                var data = { state: { url: search, params: params }, url: search };
                this._pushState(data);
                return data;
            }
            else {
                return this.removeParam(name);
            }
        };
        UrlParams.prototype.removeParam = function (name) {
            var sourceUrl = location.search;
            var rtn = sourceUrl.split('?')[0];
            var param;
            var paramsArr;
            var queryString = (sourceUrl.indexOf('?') !== -1) ? sourceUrl.split('?')[1] : '';
            if (queryString !== '') {
                paramsArr = queryString.split('&');
                for (var i = paramsArr.length - 1; i >= 0; i -= 1) {
                    param = paramsArr[i].split('=')[0];
                    if (param === name) {
                        paramsArr.splice(i, 1);
                    }
                }
                rtn = rtn + '?' + paramsArr.join('&');
            }
            delete this._params[name];
            var data = { state: { url: rtn, type: 'remove' }, url: rtn };
            this._pushState(data);
            return data;
        };
        UrlParams.prototype._pushState = function (data) {
            if (history) {
                history.replaceState(data.state, document.title, data.url);
            }
        };
        return UrlParams;
    }());
    exports.UrlParams = UrlParams;
});
//# sourceMappingURL=url-runtime-params.js.map