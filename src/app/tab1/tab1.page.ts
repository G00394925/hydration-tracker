import { Component, HostListener } from '@angular/core';
import { IonHeader, IonToolbar, IonList, IonItem, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [RoundProgressModule, IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton],
})

export class Tab1Page {
  dailyGoal: number = 2000; // Recommended daily intake is 2L by default
  currentProgress: number = 0;
  progressPercentage: number = 0;
  maxPercentage: number = 100;

  windowWidth: number = window.innerWidth;
  windowHeight: number = window.innerHeight;

  constructor() {}

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  calculateRadius(): number {
    if(this.windowWidth < 360 || this.windowHeight < 800) {
      return 70;
    } else if (this.windowWidth < 480) {
      return 100;
    } else {
      return 150;
    }
  }

  calculateStroke(): number {
    const radius = this.calculateRadius();
    return Math.max(Math.floor(radius * 0.2), 15)
  }

  addProgress(amount: number) {
    this.currentProgress += amount
    this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100);
    
    if (this.progressPercentage > 100) {
      this.progressPercentage = 100;
    }
  }


}
