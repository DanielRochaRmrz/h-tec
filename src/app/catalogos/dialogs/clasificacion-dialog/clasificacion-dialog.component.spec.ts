import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionDialogComponent } from './clasificacion-dialog.component';

describe('ClasificacionDialogComponent', () => {
  let component: ClasificacionDialogComponent;
  let fixture: ComponentFixture<ClasificacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasificacionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClasificacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
