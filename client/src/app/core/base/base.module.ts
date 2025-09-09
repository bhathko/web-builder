import { ComponentFactoryResolver, inject, Type } from "@angular/core";

export abstract class BaseModule {
  private selectorToFactory!: Map<string, any>;
  protected dynamicComponents!: Type<any>[];
  protected componentFactoryResolver = inject(ComponentFactoryResolver);

  public getComponentFactory(selector: string): any {
    if (!this.selectorToFactory) {
      this.populateRegistry();
    }

    return this.selectorToFactory.get(`app-${selector}`);
  }

  private populateRegistry() {
    this.selectorToFactory = new Map<string, any>();
    this.dynamicComponents.forEach((type) => {
      const componentFactory: any =
      this.componentFactoryResolver.resolveComponentFactory(type);
      this.selectorToFactory.set(componentFactory.selector, componentFactory);
    });
  }
}
