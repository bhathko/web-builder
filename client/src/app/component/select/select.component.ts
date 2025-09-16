import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { SelectOption } from '../../core/model/Common.type';

@Component({
  selector: 'app-select',
  imports: [MatSelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  @Input() title?: string;
  @Input() data: Array<SelectOption> = [];
}
