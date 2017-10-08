import { ContextMenuContentComponent } from './contextMenuContent.component';
import { ContextMenuItemDirective } from './contextMenu.item.directive';
import { IContextMenuOptions } from './contextMenu.options';
import { ContextMenuService, IContextMenuClickEvent } from './contextMenu.service';
import { ContextMenuInjectorService } from './contextMenuInjector.service';
import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, QueryList } from '@angular/core';
export interface ILinkConfig {
    click: (item: any, $event?: MouseEvent) => void;
    enabled?: (item: any) => boolean;
    html: (item: any) => string;
}
export interface MouseLocation {
    left?: string;
    marginLeft?: string;
    marginTop?: string;
    top?: string;
}
export declare class ContextMenuComponent implements OnDestroy {
    private _contextMenuService;
    private changeDetector;
    private elementRef;
    private options;
    private contextMenuInjector;
    autoFocus: boolean;
    useBootstrap4: boolean;
    disabled: boolean;
    close: EventEmitter<any>;
    open: EventEmitter<any>;
    menuItems: QueryList<ContextMenuItemDirective>;
    menuElement: ElementRef;
    visibleMenuItems: ContextMenuItemDirective[];
    contextMenuContent: ContextMenuContentComponent;
    links: ILinkConfig[];
    item: any;
    event: MouseEvent;
    private mouseLocation;
    private subscription;
    constructor(_contextMenuService: ContextMenuService, changeDetector: ChangeDetectorRef, elementRef: ElementRef, options: IContextMenuOptions, contextMenuInjector: ContextMenuInjectorService);
    ngOnDestroy(): void;
    onMenuEvent(menuEvent: IContextMenuClickEvent): void;
    destroySubMenus(parent: ContextMenuContentComponent): void;
    destroyLeafMenu(): void;
    isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean;
    setVisibleMenuItems(): void;
    evaluateIfFunction(value: any): any;
}
