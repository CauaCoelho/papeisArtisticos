import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bloco } from './bloco';

describe('Bloco', () => {
  let component: Bloco;
  let fixture: ComponentFixture<Bloco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bloco],
    }).compileComponents();

    fixture = TestBed.createComponent(Bloco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
