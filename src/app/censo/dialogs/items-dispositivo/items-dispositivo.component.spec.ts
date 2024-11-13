import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsDispositivoComponent } from './items-dispositivo.component';

describe('ItemsDispositivoComponent', () => {
  let component: ItemsDispositivoComponent;
  let fixture: ComponentFixture<ItemsDispositivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsDispositivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
