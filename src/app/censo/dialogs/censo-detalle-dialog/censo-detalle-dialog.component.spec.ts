import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoDetalleDialogComponent } from './censo-detalle-dialog.component';

describe('CensoDetalleDialogComponent', () => {
  let component: CensoDetalleDialogComponent;
  let fixture: ComponentFixture<CensoDetalleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CensoDetalleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CensoDetalleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
