import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IonHeader, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

Chart.register(...registerables);

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTitle, IonContent, ExploreContainerComponent]
})
export class Tab2Page implements AfterViewInit {
  @ViewChild('myChart') myChart: ElementRef | undefined;
  chart: any;

  constructor() {}

  ngAfterViewInit(): void {
      this.createChart();
  }

  createChart() {
    if(this.myChart?.nativeElement) {
      this.chart = new Chart(this.myChart?.nativeElement, {
        type: 'line',
        data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
            label: 'Water Intake',
            data: [2000, 1500, 1000, 3000, 2500, 2200, 1600],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Water Intake (ml)'
              }
            }
          }
        }
      })
    } else {
      console.error('Chart element not found');
    }
  }
}
