import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, map, Subscription } from 'rxjs';
import { ComponentService } from '../../core/service/component.service';
import { DomService } from '../../core/service/dom.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  id = '';
  http = inject(HttpClient);
  domService = inject(DomService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  currentUrl = signal<string>('');
  subscription = new Subscription();

  toggleLeftSideBar = output<void>();

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((result) => {
        this.currentUrl.update(() => result.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  print() {
    console.log(JSON.stringify(this.domService.getRoot()));
  }

  sendDataToServer() {
    this.http
      .post('http://localhost:3000/api/component-tree', {
        pageName: 'HomePage',
        pageId: 'home-page-1',
        component: this.domService.getRoot(),
      })
      .subscribe(
        (response) => {
          console.log('Data sent successfully:', response);
          this.id = (response as any).data._id;
        },
        (error) => {
          console.error('Error sending data:', error);
        }
      );
  }

  generateProject() {
    this.http
      .post(`http://localhost:3000/api/project/generate/${this.id}`, {})
      .subscribe((res) => {
        console.log(res);
      });

    // this.http
    //   .get('http://localhost:3000/api/project/status/689ab7a5482323296506cfff')
    //   .subscribe(console.log);
  }
  getComponentStatus() {
    this.http
      .get(`http://localhost:3000/api/project/status/${this.id}`)
      .subscribe(console.log);
  }

  getDownload() {
    this.http
      .get(`http://localhost:3000/api/project/download/${this.id}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          // Get the Content-Disposition header
          const contentDisposition = response.headers.get(
            'Content-Disposition'
          );
          const filename =
            this.getFilenameFromContentDisposition(contentDisposition);

          // Return both the blob and the filename
          return {
            blob: response.body,
            filename: filename || 'default.zip',
          };
        })
      )
      .subscribe(
        (result) => {
          // Create a URL for the blob
          if (!result.blob) {
            console.error('No file received');
            return;
          }
          const url = window.URL.createObjectURL(result.blob);

          // Create a temporary link element to trigger the download
          const a = document.createElement('a');
          a.href = url;
          a.download = result.filename;

          // Append, click, and clean up
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        (error) => {
          console.error('File download failed:', error);
        }
      );
  }

  onPreview() {
    localStorage.setItem(
      'previewData',
      JSON.stringify(this.domService.getRoot())
    );

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/preview'])
    );
    window.open(url, '_blank');
  }

  onBuilder() {
    this.router.navigate(['/builder']);
  }

  toggleComponentList() {
    this.toggleLeftSideBar.emit();
  }

  private getFilenameFromContentDisposition(
    disposition: string | null
  ): string | null {
    if (!disposition) {
      return null;
    }
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
    return null;
  }
}

export enum ComponentType {
  INPUT = 'input',
  BUTTON = 'button',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  DIV = 'div',
  SPAN = 'span',
  LABEL = 'label',
  FORM = 'form',
  TABLE = 'table',
  TR = 'tr',
  TD = 'td',
  TH = 'th',
  UL = 'ul',
  OL = 'ol',
  LI = 'li',
  NAV = 'nav',
  HEADER = 'header',
  FOOTER = 'footer',
  ARTICLE = 'article',
  SECTION = 'section',
  ASIDE = 'aside',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
  IMG = 'img',
  A = 'a',
  IFRAME = 'iframe',
  CANVAS = 'canvas',
  SVG = 'svg',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  SCRIPT = 'script',
}
