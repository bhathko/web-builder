import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PlaceHolderConfig } from '../../../service/placeholder.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  imports: [NgStyle],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss',
})
export class PlaceholderComponent {
  @Input() config: PlaceHolderConfig | null | undefined;
  @ViewChild('.placeholder') tipLineRef: ElementRef | undefined;

  ngOnInit(): void {
    if (this.config) {
      this.setTipLineStyle(this.config);
    }
  }

  setTipLineStyle(config: PlaceHolderConfig): void {
    if (this.tipLineRef) {
      const tipLineElement = this.tipLineRef.nativeElement;
      console.log('Setting tip line style:', config);
    }
  }
}
