import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDynamicElement } from '../model/Config';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  rightPanel = signal<boolean>(false);

  leftPanel = signal<boolean>(false);

  elementData = new BehaviorSubject<IDynamicElement | null>(null);

  openRightPanel() {
    this.rightPanel.update(() => true);
  }

  closeRightPanel() {
    this.rightPanel.update(() => false);
  }

  openLeftPanel() {
    this.leftPanel.update(() => true);
  }

  closeLeftPanel() {
    this.leftPanel.update(() => false);
  }
  toggleLeftPanel() {
    this.leftPanel.update((value) => !value);
  }

  setElementData(data: IDynamicElement | null) {
    this.elementData.next(data);
  }

  getElementData() {
    return this.elementData.asObservable();
  }
}
