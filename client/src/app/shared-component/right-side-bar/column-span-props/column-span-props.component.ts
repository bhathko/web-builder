import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { IDynamicElement } from '../../../core/model/Config.type';

@Component({
  selector: 'app-column-span-props',
  imports: [MatInputModule],
  templateUrl: './column-span-props.component.html',
  styleUrl: './column-span-props.component.scss',
})
export class ColumnSpanPropsComponent {
  @Input() element!: IDynamicElement;

  hasGridParent: boolean = false;

  onColSpanChange(event: any) {
    if (this.element) {
      this.element.props = {
        ...this.element.props,
        colSpan: event,
      };
    }
  }
}
