import { Component, inject, Input } from '@angular/core';
import { IDynamicElement } from '../../../core/model/Config.type';
import { MatIconModule } from '@angular/material/icon';
import { ExtraPanelService } from '../../../core/service/extra-panel.service';
import { OptionEditorComponent } from '../../option-editor/option-editor.component';
import { OptionEditorService } from '../../option-editor/option-editor.service';
import { SelectOption } from '../../../core/model/Common.type';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-select-props',
  imports: [MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './select-props.component.html',
  styleUrl: './select-props.component.scss',
})
export class SelectPropsComponent {
  @Input() element!: IDynamicElement;

  extraPanelService = inject(ExtraPanelService);
  optionEditorService = inject(OptionEditorService);
  onDeleteOption(index: number) {
    if (this.element && this.element['data']) {
      this.element['data'].splice(index, 1);
    }
  }

  onEditOption(index: number) {
    this.optionEditorService.setOption(
      this.element['data'][index],
      (updatedOption: SelectOption) => {
        if (index !== undefined && updatedOption) {
          this.element['data'][index] = updatedOption;
        }
      }
    );
    this.extraPanelService.open([OptionEditorComponent]);
  }

  onAddOption() {
    const newOption = { label: 'Option', value: 'option' };
    this.optionEditorService.setOption(
      newOption,
      (createdOption: SelectOption) => {
        if (createdOption) {
          if (!this.element['data']) {
            this.element['data'] = [];
          }
          this.element['data'].push(createdOption);
        }
      }
    );
    this.extraPanelService.open([OptionEditorComponent]);
  }
}
