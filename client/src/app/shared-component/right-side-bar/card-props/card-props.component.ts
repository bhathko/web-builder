import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { IDynamicElement } from '../../../core/model/Config.type';

@Component({
  selector: 'app-card-props',
  imports: [MatSelectModule],
  templateUrl: './card-props.component.html',
  styleUrl: './card-props.component.scss',
})
export class CardPropsComponent {
  @Input() element!: IDynamicElement;

  alignOptions = [
    { label: 'Horizontal', value: 'horizontal' },
    { label: 'Vertical', value: 'vertical' },
  ];

  onAlignChange(event: any) {
    if (this.element) {
      this.element.props = {
        ...this.element.props,
        align: event,
      };
    }
  }
}
