import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoDialogComponent } from './censo-dialog.component';

describe('CensoDialogComponent', () => {
  let component: CensoDialogComponent;
  let fixture: ComponentFixture<CensoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CensoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CensoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
