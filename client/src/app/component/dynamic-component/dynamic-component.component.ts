import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  signal,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DndModule } from 'ngx-drag-drop';
import { IDynamicElement } from '../../core/model/Config';
import { UtilsService } from '../../core/service/utils.service';
import { DomService } from '../../core/service/dom.service';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BACKSPACE, DELETE } from '@angular/cdk/keycodes';
import { PlaceholderService } from '../../core/service/placeholder.service';
import { COMPONENT_MAP } from '../components.module';
import { RightPanelService } from '../../core/service/right-panel.service';

@Component({
  selector: 'app-dynamic-component',
  imports: [DndModule],
  templateUrl: './dynamic-component.component.html',
  styleUrl: './dynamic-component.component.scss',
  host: {
    '[attr.id]': 'element.id',
    '[attr.tabindex]': '0',
    '[class.fit-content]': '!isLayoutComponent()',
    '[class.layout-content]': 'isLayoutComponent()',
    '(keydown)': '_onKeydown($event)',
    '(click)': '_onClick($event)',
  },
})
export class DynamicComponentComponent implements AfterViewInit, OnDestroy {
  @Input() element!: IDynamicElement;
  @Input() index!: number; // just for animate count
  dndDraggable!: IDynamicElement;

  @ViewChild('container', { read: ViewContainerRef })
  private container!: ViewContainerRef;

  isLayoutComponent = signal(false);

  _focusMonitor = inject(FocusMonitor);
  _ngZone = inject(NgZone);
  _cdr = inject(ChangeDetectorRef);

  rightPanelService = inject(RightPanelService);

  placeholderService = inject(PlaceholderService);

  dynamicComponent!: Type<any>;

  private ele = inject(ElementRef);
  public showToolbar = signal(false);
  private utilsService = inject(UtilsService);
  private domService = inject(DomService);
  readonly environmentInjector = inject(EnvironmentInjector);
  public componentRef:
    | ComponentRef<unknown>
    | ComponentRef<any>
    | undefined
    | any;
  public compContent = signal<any>({});

  @HostListener('dndStart', ['$event'])
  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setDragImage(this.utilsService.dragImage, 0, 0);
    const dragHelper = this.domService.getDragHelper();
    this.domService.setDragHelper({
      ...dragHelper,
      srcNode: this.element,
    });
  }

  @HostListener('dndEnd', ['$event'])
  onDragEnd(): void {
    this.placeholderService.hide();
  }

  ngOnChanges(changes: SimpleChanges): void {
    Object.keys(changes).forEach((key) => {
      if (!changes[key].firstChange) {
        this.loadComponent();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadComponent();
    if (this.element) {
      this.isLayoutComponent.set(
        this.utilsService.isLayoutComponent(this.element.type ?? 'unknown')
      );
    }
    this._focusMonitor
      .monitor(this.ele, false)
      .subscribe((origin: FocusOrigin) => {
        this._ngZone.run(() => {
          this.formatOrigin(origin);
          this._cdr.markForCheck();
        });
      });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this.ele);
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  loadComponent() {
    if (this.element && this.element.type) {
      const componentType = COMPONENT_MAP.get(this.element.type);
      if (!componentType) {
        console.warn(
          `Component type "${this.element.type}" not found in COMPONENT_MAP.`
        );
        return;
      }
      const component = this.container.createComponent(componentType, {
        environmentInjector: this.environmentInjector,
      });
      component.instance.element = this.element;
    }
  }

  _onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.rightPanelService.setElementData(this.element);
    this.rightPanelService.openPanel();
  }

  formatOrigin(origin: FocusOrigin): string {
    return origin ? origin + ' focused' : 'blurred';
  }

  _onKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (event.keyCode === BACKSPACE || event.keyCode === DELETE) {
      const parent = this.domService.getParent(this.element.id ?? '');
      parent?.children?.splice(
        parent.children.findIndex((item) => item.id === this.element.id),
        1
      );
    }
  }
}
