import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { IDynamicElement } from '../../../core/model/Config.type';

@Component({
  selector: 'app-grid-view-props',
  imports: [MatSelectModule],
  templateUrl: './grid-view-props.component.html',
  styleUrl: './grid-view-props.component.scss',
})
export class GridViewPropsComponent {
  @Input() element!: IDynamicElement;

  gridColumnOptions = [
    { label: '1 Col', value: '1' },
    { label: '2 Col', value: '2' },
    { label: '3 Col', value: '3' },
    { label: '4 Col', value: '4' },
    { label: '6 Col', value: '6' },
    { label: '12 Col', value: '12' },
  ];

  onGridColChange(event: any) {
    if (this.element) {
      this.element.props = {
        ...this.element.props,
        column: event,
      };
    }
  }
}
