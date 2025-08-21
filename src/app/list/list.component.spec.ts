import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [CommonModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // Flush initial JSON request (DEV.to) triggered by ngOnInit
    const req = httpMock.expectOne('https://dev.to/api/articles?per_page=30');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        title: 'Sample Title',
        url: 'https://example.com/article',
        published_at: '2025-08-20T10:00:00Z',
        cover_image: 'https://example.com/image.jpg',
        description: 'Sample description',
      },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
