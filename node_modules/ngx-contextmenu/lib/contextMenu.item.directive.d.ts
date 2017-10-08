import { ContextMenuComponent } from './contextMenu.component';
import { EventEmitter, TemplateRef, ElementRef } from '@angular/core';
export declare class ContextMenuItemDirective {
    template: TemplateRef<{
        item: any;
    }>;
    elementRef: ElementRef;
    subMenu: ContextMenuComponent;
    divider: boolean;
    enabled: boolean | ((item: any) => boolean);
    passive: boolean;
    visible: boolean | ((item: any) => boolean);
    execute: EventEmitter<{
        event: Event;
        item: any;
    }>;
    constructor(template: TemplateRef<{
        item: any;
    }>, elementRef: ElementRef);
    evaluateIfFunction(value: any, item: any): any;
    triggerExecute(item: any, $event?: MouseEvent): void;
}
