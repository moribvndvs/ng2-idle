import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickstartComponent } from './quickstart.component';

describe('QuickstartComponent', () => {
  let component: QuickstartComponent;
  let fixture: ComponentFixture<QuickstartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickstartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickstartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
