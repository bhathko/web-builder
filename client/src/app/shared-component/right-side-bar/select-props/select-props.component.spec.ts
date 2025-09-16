import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPropsComponent } from './select-props.component';

describe('SelectPropsComponent', () => {
  let component: SelectPropsComponent;
  let fixture: ComponentFixture<SelectPropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPropsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
