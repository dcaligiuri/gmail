var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { ContextMenuItemDirective } from './contextMenu.item.directive';
import { CONTEXT_MENU_OPTIONS } from './contextMenu.options';
import { ContextMenuService } from './contextMenu.service';
import { ContextMenuInjectorService } from './contextMenuInjector.service';
import { ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, HostListener, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
var ContextMenuComponent = (function () {
    function ContextMenuComponent(_contextMenuService, changeDetector, elementRef, options, contextMenuInjector) {
        var _this = this;
        this._contextMenuService = _contextMenuService;
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
        this.options = options;
        this.contextMenuInjector = contextMenuInjector;
        this.autoFocus = false;
        this.useBootstrap4 = false;
        this.disabled = false;
        this.close = new EventEmitter();
        this.open = new EventEmitter();
        this.visibleMenuItems = [];
        this.links = [];
        this.mouseLocation = { left: '0px', top: '0px' };
        this.subscription = new Subscription();
        if (options) {
            this.autoFocus = options.autoFocus;
            this.useBootstrap4 = options.useBootstrap4;
        }
        this.subscription.add(_contextMenuService.show.subscribe(function (menuEvent) { return _this.onMenuEvent(menuEvent); }));
        this.subscription.add(_contextMenuService.triggerClose.subscribe(function (contextMenuContent) {
            if (!contextMenuContent) {
                _this.contextMenuInjector.destroyAll();
            }
            else {
                _this.destroySubMenus(contextMenuContent);
                _this.contextMenuInjector.destroy(contextMenuContent);
            }
        }));
        this.subscription.add(_contextMenuService.close.subscribe(function (event) { return _this.close.emit(event); }));
    }
    ContextMenuComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
        this.contextMenuInjector.destroyAll();
    };
    ContextMenuComponent.prototype.onMenuEvent = function (menuEvent) {
        var _this = this;
        if (this.disabled) {
            return;
        }
        var contextMenu = menuEvent.contextMenu, event = menuEvent.event, item = menuEvent.item;
        if (!menuEvent.parentContextMenu) {
            this.contextMenuInjector.destroyAll();
        }
        else {
            this.destroySubMenus(menuEvent.parentContextMenu);
        }
        if (contextMenu && contextMenu !== this) {
            return;
        }
        this.event = event;
        this.item = item;
        setTimeout(function () {
            _this.setVisibleMenuItems();
            _this.contextMenuContent = _this.contextMenuInjector.create(__assign({ menuItems: _this.visibleMenuItems }, menuEvent));
            _this.open.next(menuEvent);
        });
    };
    ContextMenuComponent.prototype.destroySubMenus = function (parent) {
        var _this = this;
        var cmContents = this.contextMenuInjector.getByType(this.contextMenuInjector.type);
        cmContents.filter(function (content) { return content.instance.parentContextMenu === parent; })
            .forEach(function (comp) {
            _this.destroySubMenus(comp.instance);
            _this.contextMenuInjector.destroy(comp);
        });
    };
    ContextMenuComponent.prototype.destroyLeafMenu = function () {
        this._contextMenuService.destroyLeafMenu();
    };
    ContextMenuComponent.prototype.isMenuItemVisible = function (menuItem) {
        return this.evaluateIfFunction(menuItem.visible);
    };
    ContextMenuComponent.prototype.setVisibleMenuItems = function () {
        var _this = this;
        this.visibleMenuItems = this.menuItems.filter(function (menuItem) { return _this.isMenuItemVisible(menuItem); });
    };
    ContextMenuComponent.prototype.evaluateIfFunction = function (value) {
        if (value instanceof Function) {
            return value(this.item);
        }
        return value;
    };
    return ContextMenuComponent;
}());
export { ContextMenuComponent };
ContextMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'context-menu',
                template: "",
            },] },
];
/** @nocollapse */
ContextMenuComponent.ctorParameters = function () { return [
    { type: ContextMenuService, },
    { type: ChangeDetectorRef, },
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONTEXT_MENU_OPTIONS,] },] },
    { type: ContextMenuInjectorService, },
]; };
ContextMenuComponent.propDecorators = {
    'autoFocus': [{ type: Input },],
    'useBootstrap4': [{ type: Input },],
    'disabled': [{ type: Input },],
    'close': [{ type: Output },],
    'open': [{ type: Output },],
    'menuItems': [{ type: ContentChildren, args: [ContextMenuItemDirective,] },],
    'menuElement': [{ type: ViewChild, args: ['menu',] },],
    'destroyLeafMenu': [{ type: HostListener, args: ['window:keydown.Escape',] },],
};
//# sourceMappingURL=contextMenu.component.js.map