import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExtraPanelService {
  private _open$ = new BehaviorSubject<Array<Type<any>>>([]);
  open$ = this._open$.asObservable();

  open(components: Array<Type<any>>) {
    this._open$.next(components);
  }
  close() {
    this._open$.next([]);
  }
}
