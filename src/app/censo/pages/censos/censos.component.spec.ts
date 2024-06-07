import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CensosComponent } from './censos.component';

describe('CensosComponent', () => {
  let component: CensosComponent;
  let fixture: ComponentFixture<CensosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CensosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CensosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
