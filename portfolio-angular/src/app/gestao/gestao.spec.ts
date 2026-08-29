import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestao } from './gestao';

describe('Gestao', () => {
  let component: Gestao;
  let fixture: ComponentFixture<Gestao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestao],
    }).compileComponents();

    fixture = TestBed.createComponent(Gestao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
