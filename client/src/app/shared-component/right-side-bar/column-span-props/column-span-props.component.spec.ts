import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSpanPropsComponent } from './column-span-props.component';

describe('ColumnSpanPropsComponent', () => {
  let component: ColumnSpanPropsComponent;
  let fixture: ComponentFixture<ColumnSpanPropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnSpanPropsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnSpanPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
