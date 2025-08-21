import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Article = {
  title: string;
  urlToImage?: string | null;
  publishedAt: string; // ISO string
  url?: string;
  description?: string;
};

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  error: string | null = null;
  // Public, no-key JSON API with CORS: DEV.to articles
  private readonly API_URL = 'https://dev.to/api/articles?per_page=30';

  constructor(private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any[]>(this.API_URL).subscribe({
      next: (rows) => {
        try {
          const arr = Array.isArray(rows) ? rows : [];
          this.articles = arr.map((r) => {
            const title: string = r?.title ?? '';
            const url: string | undefined =
              r?.url ?? r?.canonical_url ?? undefined;
            const publishedAt: string = r?.published_at
              ? new Date(r.published_at).toISOString()
              : new Date().toISOString();
            const urlToImage: string | null =
              r?.cover_image ?? r?.social_image ?? null;
            const description: string | undefined = r?.description ?? undefined;
            return { title, url, publishedAt, urlToImage, description };
          });
          this.loading = false;
        } catch {
          this.error = 'Gagal memproses data.';
          this.loading = false;
        }
      },
      error: (err) => {
        const msg = err?.message || err?.statusText || 'Gagal memuat data.';
        this.error = msg;
        this.loading = false;
      },
    });
  }

  onImgError(evt: Event): void {
    const el = evt.target as HTMLImageElement;
    // Simple placeholder if image URL is missing/broken
    el.src = 'https://via.placeholder.com/348x225?text=No+Image';
  }
}
