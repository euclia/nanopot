import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdbReaderComponent } from './pdb-reader.component';

describe('PdbReaderComponent', () => {
  let component: PdbReaderComponent;
  let fixture: ComponentFixture<PdbReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdbReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdbReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
