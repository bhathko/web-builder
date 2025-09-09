import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DynamicComponentComponent } from '../dynamic-component/dynamic-component.component';
import { DndModule } from 'ngx-drag-drop';
import { BaseComponent } from '../../core/base/base-component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, DndModule, DynamicComponentComponent, NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent extends BaseComponent implements OnInit {
  @ViewChild('block', { static: true })
  dragImageRef!: ElementRef;
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
