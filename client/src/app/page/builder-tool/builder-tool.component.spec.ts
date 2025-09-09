import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderToolComponent } from './builder-tool.component';

describe('BuilderToolComponent', () => {
  let component: BuilderToolComponent;
  let fixture: ComponentFixture<BuilderToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
