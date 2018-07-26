import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloydComponent } from './floyd.component';

describe('FloydComponent', () => {
  let component: FloydComponent;
  let fixture: ComponentFixture<FloydComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloydComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloydComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
