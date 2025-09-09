import { Component } from '@angular/core';
import { PreviewBaseDirective } from '../preview-base/preview-base';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-preview-card',
  imports: [MatCardModule, NgClass],
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss',
})
export class PreviewCardComponent extends PreviewBaseDirective {}
