import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicosDialogComponent } from './tecnicos-dialog.component';

describe('TecnicosDialogComponent', () => {
  let component: TecnicosDialogComponent;
  let fixture: ComponentFixture<TecnicosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicosDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TecnicosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
