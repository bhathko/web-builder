import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPropsComponent } from './card-props.component';

describe('CardPropsComponent', () => {
  let component: CardPropsComponent;
  let fixture: ComponentFixture<CardPropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPropsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
