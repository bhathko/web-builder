import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPanelComponent } from './extra-panel.component';

describe('ExtraPanelComponent', () => {
  let component: ExtraPanelComponent;
  let fixture: ComponentFixture<ExtraPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
