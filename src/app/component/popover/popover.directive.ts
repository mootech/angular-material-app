/**
 * @license
 * Copyright Stbui All Rights Reserved.
 */

import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ViewContainerRef, TemplateRef } from '@angular/core';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  ConnectedPositionStrategy,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { PopoverComponent } from './popover.component';

@Directive({
  selector: '[stbuiPopover],[popoverTriggerFor]',
  host: {
    '(click)': 'togglePopover()'
  },
  exportAs: 'popoverDirective'
})
export class PopoverDirective implements AfterViewInit {
  @Input('popoverTriggerFor') popover;
  @Input() popoverTitle: string;
  @Input() popoverMessage: string;
  @Input() confirmText: string;
  @Input() cancelText: string;
  @Input() placement: string;
  @Input() isOpen: boolean = false;
  @Input() template;

  private portal;

  constructor(
    private _elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay
  ) {}

  ngAfterViewInit() {
    this._checkPopover();
  }

  private _checkPopover() {
    if (!this.popover) {
      throw new Error(`
      Example:
        <stbui-popover #popover="stbPopover"></stbui-popover>
        <button [popoverTriggerFor]="popover"></button>
      `);
    }
  }

  togglePopover() {
    // this.popover.toggle();
    // this.popover.trigger = this._elementRef.nativeElement;

    this.show();
  }

  show() {
    const overlayRef = this._createOverlay();
    console.log(this.portal);
    overlayRef.attach(this.portal);
  }

  hide() {}

  private _createOverlay() {
    this.portal = new TemplatePortal(
      this.popover.templateRef,
      this.viewContainerRef
    );

    const confg = this._getOverlayConfig();

    return this.overlay.create(confg);
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getPositionStrategy(),
      backdropClass: 'cdk-overlay-transparent-backdrop',
      direction: 'ltr'
    });
  }

  private _getPositionStrategy() {
    let [originX, originFallbackX]: HorizontalConnectionPos[] = ['end', 'start'];
    let [overlayY, overlayFallbackY]: VerticalConnectionPos[] = ['bottom', 'top'];

    let [originY, originFallbackY] = [overlayY, overlayFallbackY];
    let [overlayX, overlayFallbackX] = [originX, originFallbackX];

    const strategy = this.overlay
      .position()
      .connectedTo(
        this._elementRef,
        { originX, originY },
        { overlayX, overlayY }
      )
      .withDirection('rtl')
      .withLockedPosition(false);

    return strategy;
  }
}
