import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarExclusao } from './confirmar-exclusao';

describe('ConfirmarExclusao', () => {
  let component: ConfirmarExclusao;
  let fixture: ComponentFixture<ConfirmarExclusao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarExclusao],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarExclusao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
