import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickstartComponent } from './quickstart.component';
import { provideHighlightOptions } from 'ngx-highlightjs';

describe('QuickstartComponent', () => {
  let component: QuickstartComponent;
  let fixture: ComponentFixture<QuickstartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickstartComponent],
      providers : [provideHighlightOptions({
        fullLibraryLoader: () => import('highlight.js')
      }),]
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
