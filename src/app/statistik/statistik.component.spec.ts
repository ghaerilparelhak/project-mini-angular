import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StatistikComponent } from './statistik.component';

describe('StatistikComponent', () => {
  let component: StatistikComponent;
  let fixture: ComponentFixture<StatistikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatistikComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StatistikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
