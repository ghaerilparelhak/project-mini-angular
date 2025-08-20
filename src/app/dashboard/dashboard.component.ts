import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private chart: ApexCharts | null = null;

  @ViewChild('chartEl', { static: true }) chartEl!: ElementRef<HTMLElement>;

  chartOptions: any = {
    chart: { height: 350, type: 'line', stacked: false },
    dataLabels: { enabled: false },
    colors: ['#FF1654', '#247BA0'],
    series: [],
    stroke: { width: [3, 3] },
    xaxis: { categories: [] },
    yaxis: [
      {
        axisTicks: { show: true },
        axisBorder: { show: true, color: '#FF1654' },
        labels: { style: { colors: '#FF1654' } },
        title: { text: 'USD→EUR', style: { color: '#FF1654' } },
      },
      {
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true, color: '#247BA0' },
        labels: { style: { colors: '#247BA0' } },
        title: { text: 'USD→IDR', style: { color: '#247BA0' } },
      },
    ],
    tooltip: { shared: false, intersect: true, x: { show: false } },
    legend: { horizontalAlign: 'left', offsetX: 40 },
  };

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    const el = this.chartEl?.nativeElement;
    if (!el) return;

    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 9);
      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);

      // Ganti ke Frankfurter (tanpa API key, CORS aman)
      const url = `https://api.frankfurter.app/${startStr}..${endStr}?from=USD&to=EUR,IDR`;
      const res: any = await firstValueFrom(this.http.get(url));
      const rates = res?.rates ?? {};

      const dates = Object.keys(rates).sort();
      const eur = dates.map((d) => rates[d]?.EUR).filter((v) => v != null);
      const idr = dates.map((d) => rates[d]?.IDR).filter((v) => v != null);

      this.chartOptions.xaxis = { categories: dates };
      this.chartOptions.series = [
        { name: 'USD→EUR', data: eur },
        { name: 'USD→IDR', data: idr },
      ];
    } catch (e) {
      console.error('Gagal memuat data Frankfurter', e);
      this.chartOptions.xaxis = {
        categories: [
          'D1',
          'D2',
          'D3',
          'D4',
          'D5',
          'D6',
          'D7',
          'D8',
          'D9',
          'D10',
        ],
      };
      this.chartOptions.series = [
        {
          name: 'USD→EUR',
          data: [0.92, 0.93, 0.93, 0.94, 0.93, 0.92, 0.91, 0.92, 0.93, 0.94],
        },
        {
          name: 'USD→IDR',
          data: [
            16200, 16180, 16150, 16190, 16220, 16240, 16210, 16170, 16150,
            16190,
          ],
        },
      ];
    }

    this.chart = new ApexCharts(el, this.chartOptions);
    this.chart.render();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}
