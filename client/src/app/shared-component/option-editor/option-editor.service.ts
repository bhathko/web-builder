import { Injectable } from '@angular/core';
import { IDynamicElement } from '../../core/model/Config.type';
import { SelectOption } from '../../core/model/Common.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OptionEditorService {
  private optionSetter = new BehaviorSubject<{
    option: SelectOption;
    callBackFn: (option: SelectOption) => void;
  } | null>(null);

  option$ = this.optionSetter.asObservable();

  setOption(option: SelectOption, fn: (option: SelectOption) => void) {
    this.optionSetter.next({ option, callBackFn: fn });
  }

  clear() {
    this.optionSetter.next(null);
  }
}
