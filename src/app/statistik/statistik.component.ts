import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-statistik',
  standalone: false,
  templateUrl: './statistik.component.html',
  styleUrls: ['./statistik.component.css'],
})
export class StatistikComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: ApexCharts | null = null;

  chartOptions: any = {
    chart: {
      height: 280,
      type: 'area',
    },
    dataLabels: { enabled: false },
    series: [
      {
        name: 'Suhu (°C)',
        data: [],
      },
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: [],
    },
  };

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    // Ambil suhu per jam di Jakarta (Open-Meteo, public & aman)
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m&forecast_days=1&timezone=auto';

    try {
      const res: any = await firstValueFrom(this.http.get(url));
      const times: string[] = (res?.hourly?.time ?? []).slice(0, 12);
      const temps: number[] = (res?.hourly?.temperature_2m ?? []).slice(0, 12);

      const categories = times.map((t) => t.substring(11, 16)); // HH:MM

      // Update options
      this.chartOptions.xaxis = { categories };
      this.chartOptions.series = [{ name: 'Suhu (°C)', data: temps }];

      // Jika chart sudah dirender, update langsung
      if (this.chart) {
        await this.chart.updateOptions({ xaxis: { categories } }, false, true);
        await this.chart.updateSeries(
          [{ name: 'Suhu (°C)', data: temps }],
          true
        );
      }
    } catch (e) {
      console.error('Gagal memuat data Open-Meteo', e);
      // Fallback ke data dummy agar grafik tetap tampil
      const categories = [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
      ];
      const temps = [25, 24, 24, 25, 27, 30, 32, 33, 31, 29, 27, 26];
      this.chartOptions.xaxis = { categories };
      this.chartOptions.series = [{ name: 'Suhu (°C)', data: temps }];
      if (this.chart) {
        await this.chart.updateOptions({ xaxis: { categories } }, false, true);
        await this.chart.updateSeries(
          [{ name: 'Suhu (°C)', data: temps }],
          true
        );
      }
    }
  }

  ngAfterViewInit() {
    const el = document.querySelector('#statistik-chart') as HTMLElement | null;
    if (!el) return;

    this.chart = new ApexCharts(el, this.chartOptions);
    this.chart.render();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}
