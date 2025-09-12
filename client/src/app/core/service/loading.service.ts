import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);

  loading$ = this.loading.asObservable();

  private refreshPage = new BehaviorSubject<boolean>(false);
  refreshPage$ = this.refreshPage.asObservable();

  pageRefresh() {
    this.refreshPage.next(true);
  }

  pageRefreshed() {
    this.refreshPage.next(false);
  }

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
}
