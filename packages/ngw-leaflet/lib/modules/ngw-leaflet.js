var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import NgwMap from '@nextgis-apps/ngw-map';
import 'leaflet/dist/leaflet.css';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';
var NgwLeaflet = (function (_super) {
    __extends(NgwLeaflet, _super);
    function NgwLeaflet(options) {
        return _super.call(this, new LeafletMapAdapter(), options) || this;
    }
    return NgwLeaflet;
}(NgwMap));
export default NgwLeaflet;
//# sourceMappingURL=ngw-leaflet.js.map