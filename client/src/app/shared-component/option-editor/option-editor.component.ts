import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OptionEditorService } from './option-editor.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ExtraPanelService } from '../../core/service/extra-panel.service';
import { SelectOption } from '../../core/model/Common.type';
import { Subject, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-option-editor',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  templateUrl: './option-editor.component.html',
  styleUrl: './option-editor.component.scss',
})
export class OptionEditorComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  optionEditorService = inject(OptionEditorService);
  extraPanelService = inject(ExtraPanelService);
  option!: SelectOption;

  _destroy = new Subject<void>();

  callBackFn!: (option: SelectOption) => void;

  get optionLabelControl() {
    return this.form.get('optionLabel');
  }
  get optionValueControl() {
    return this.form.get('optionValue');
  }

  form = this.fb.group({
    optionLabel: ['', [Validators.required]],
    optionValue: ['', [Validators.required]],
  });

  ngOnInit() {
    this.optionEditorService.option$
      .pipe(takeUntil(this._destroy))
      .subscribe((setter) => {
        console.log('setter', setter);
        if (setter) {
          this.form.patchValue({
            optionLabel: setter.option.label,
            optionValue: setter.option.value,
          });
          this.callBackFn = setter.callBackFn;
        }
      });
  }
  onUpdateOption() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const updatedOption = {
      label: this.form.value.optionLabel as string,
      value: this.form.value.optionValue as string,
    };
    if (this.callBackFn) {
      this.callBackFn(updatedOption);
    }
  }

  onCancelUpdate() {
    this.extraPanelService.close();
    this.optionEditorService.clear();
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    // this.optionEditorService.clear();
  }
}
