import { ContextMenuItemDirective } from './contextMenu.item.directive';
import { IContextMenuOptions } from './contextMenu.options';
import { ContextMenuService } from './contextMenu.service';
import { AfterViewInit, ChangeDetectorRef, ElementRef, Renderer } from '@angular/core';
import { OnDestroy, OnInit, QueryList } from '@angular/core';
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
export declare class ContextMenuContentComponent implements OnInit, OnDestroy, AfterViewInit {
    private _contextMenuService;
    private changeDetector;
    private elementRef;
    private options;
    renderer: Renderer;
    menuItems: ContextMenuItemDirective[];
    item: any;
    event: MouseEvent;
    parentContextMenu: ContextMenuContentComponent;
    activeMenuItemIndex: number;
    menuElement: ElementRef;
    menuItemElements: QueryList<ElementRef>;
    autoFocus: boolean;
    useBootstrap4: boolean;
    isShown: boolean;
    isOpening: boolean;
    private mouseLocation;
    private subscription;
    constructor(_contextMenuService: ContextMenuService, changeDetector: ChangeDetectorRef, elementRef: ElementRef, options: IContextMenuOptions, renderer: Renderer);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    focus(): void;
    stopEvent($event: MouseEvent): void;
    readonly locationCss: any;
    isMenuItemEnabled(menuItem: ContextMenuItemDirective): boolean;
    isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean;
    evaluateIfFunction(value: any): any;
    isDisabled(link: ILinkConfig): boolean;
    showMenu(): void;
    clickedOutside(): void;
    hideMenu(event?: KeyboardEvent, hideAll?: boolean): void;
    nextItem(event?: KeyboardEvent): void;
    prevItem(event?: KeyboardEvent): void;
    keyboardOpenSubMenu(event?: KeyboardEvent): void;
    destroyLeafSubMenu(event: KeyboardEvent): void;
    keyboardMenuItemSelect(event?: KeyboardEvent): void;
    openSubMenu(menuItem: ContextMenuItemDirective, event: MouseEvent, target?: HTMLElement, activeMenuItemIndex?: number): void;
    onMenuItemSelect(menuItem: ContextMenuItemDirective, event: MouseEvent, target?: HTMLElement, activeMenuItemIndex?: number): void;
    private cancelEvent(event);
}
