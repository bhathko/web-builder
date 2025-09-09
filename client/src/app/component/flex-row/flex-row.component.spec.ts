import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexRowComponent } from './flex-row.component';

describe('FlexRowComponent', () => {
  let component: FlexRowComponent;
  let fixture: ComponentFixture<FlexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
