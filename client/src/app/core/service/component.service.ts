import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  registerDynamicComponent(): () => Promise<void> {
    return async () => {
      await import('../../component/components.module');
    };
  }
}
