import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select',
  imports: [MatSelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  @Input() foods: { label: string; value: string }[] = [
    { label: 'Pizza', value: 'pizza' },
    { label: 'Burger', value: 'burger' },
    { label: 'Sushi', value: 'sushi' },
  ];
}
