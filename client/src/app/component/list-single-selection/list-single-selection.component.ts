import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-list-single-selection',
  imports: [MatListModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-single-selection.component.html',
  styleUrl: './list-single-selection.component.scss',
})
export class ListSingleSelectionComponent {
  form: FormGroup;
  shoes: any[] = [
    { value: 'boots', name: 'Boots' },
    { value: 'clogs', name: 'Clogs' },
    { value: 'loafers', name: 'Loafers' },
    { value: 'moccasins', name: 'Moccasins' },
    { value: 'sneakers', name: 'Sneakers' },
  ];
  shoesControl = new FormControl();

  constructor() {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }
}
