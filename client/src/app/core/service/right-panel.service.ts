import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDynamicElement } from '../model/Config';

@Injectable({
  providedIn: 'root',
})
export class RightPanelService {
  open = signal<boolean>(false);
  elementData = new BehaviorSubject<IDynamicElement | null>(null);

  openPanel() {
    this.open.update(() => true);
  }

  closePanel() {
    this.open.update(() => false);
  }

  setElementData(data: IDynamicElement | null) {
    this.elementData.next(data);
  }

  getElementData() {
    return this.elementData.asObservable();
  }
}
