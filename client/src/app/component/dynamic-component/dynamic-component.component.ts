import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  inject,
  Input,
  NgZone,
  OnDestroy,
  signal,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DndModule } from 'ngx-drag-drop';
import { IDynamicElement } from '../../core/model/Config.type';
import { UtilsService } from '../../core/service/utils.service';
import { ProjectService } from '../../core/service/project.service';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BACKSPACE, DELETE } from '@angular/cdk/keycodes';
import { PlaceholderService } from '../../core/service/placeholder.service';
import { COMPONENT_MAP } from '../components.module';
import { LayoutService } from '../../core/service/layout.service';

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
    '[style.gridColumn]':
      "element.props?.['colSpan'] ? 'span ' + element.props?.['colSpan'] : null",
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

  layoutService = inject(LayoutService);

  placeholderService = inject(PlaceholderService);

  dynamicComponent!: Type<any>;

  private ele = inject(ElementRef);
  public showToolbar = signal(false);
  private utilsService = inject(UtilsService);
  private projectService = inject(ProjectService);
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
    const dragHelper = this.projectService.getDragHelper();
    this.projectService.setDragHelper({
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
      if (this.element.props) {
        Object.keys(this.element.props).forEach((key) => {
          if (key in component.instance) {
            component.instance[key] = this.element.props[key];
          }
        });
      }
      if (this.element.content && 'content' in component.instance) {
        component.instance['content'] = this.element.content;
      }
      if (this.element['data'] && 'data' in component.instance) {
        component.instance['data'] = this.element['data'];
      }
    }
  }

  _onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.layoutService.setElementData(this.element);
    this.layoutService.openRightPanel();
  }

  formatOrigin(origin: FocusOrigin): string {
    return origin ? origin + ' focused' : 'blurred';
  }

  _onKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (event.keyCode === BACKSPACE || event.keyCode === DELETE) {
      const parent = this.projectService.getNodeParent(this.element.id ?? '');
      parent?.children?.splice(
        parent.children.findIndex((item) => item.id === this.element.id),
        1
      );
    }
  }
}
