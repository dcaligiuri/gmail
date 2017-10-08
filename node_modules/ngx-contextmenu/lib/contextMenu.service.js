import { ContextMenuInjectorService } from './contextMenuInjector.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
var ContextMenuService = (function () {
    function ContextMenuService(contextMenuInjector) {
        this.contextMenuInjector = contextMenuInjector;
        this.isDestroyingLeafMenu = false;
        this.show = new Subject();
        this.triggerClose = new Subject();
        this.close = new Subject();
    }
    ContextMenuService.prototype.destroyLeafMenu = function (_a) {
        var _this = this;
        var exceptRootMenu = (_a === void 0 ? {} : _a).exceptRootMenu;
        if (this.isDestroyingLeafMenu) {
            return;
        }
        this.isDestroyingLeafMenu = true;
        setTimeout(function () {
            var cmContents = _this.contextMenuInjector.getByType(_this.contextMenuInjector.type);
            if (cmContents && cmContents.length > 1) {
                cmContents[cmContents.length - 2].instance.focus();
            }
            if (cmContents && cmContents.length > (exceptRootMenu ? 1 : 0)) {
                _this.contextMenuInjector.destroy(cmContents[cmContents.length - 1]);
            }
            _this.isDestroyingLeafMenu = false;
        });
    };
    ContextMenuService.prototype.getLeafMenu = function () {
        var cmContents = this.contextMenuInjector.getByType(this.contextMenuInjector.type);
        if (cmContents && cmContents.length > 0) {
            return cmContents[cmContents.length - 1].instance;
        }
        return undefined;
    };
    ContextMenuService.prototype.isLeafMenu = function (cmContent) {
        return this.getLeafMenu() === cmContent;
    };
    return ContextMenuService;
}());
export { ContextMenuService };
ContextMenuService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ContextMenuService.ctorParameters = function () { return [
    { type: ContextMenuInjectorService, },
]; };
//# sourceMappingURL=contextMenu.service.js.map