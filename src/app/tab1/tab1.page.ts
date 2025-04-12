import { Component, HostListener, OnInit } from '@angular/core';
import { IonHeader, IonBadge, IonLabel, IonToolbar, IonList, IonItem, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgModel } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [RoundProgressModule, IonBadge, IonLabel, IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton],
})

export class Tab1Page implements OnInit {
  dailyGoal: number = 2000; // Recommended daily intake is 2L by default
  currentProgress: number = 0;
  progressPercentage: number = 0;
  maxPercentage: number = 100;
  lastDrink: string = "";
  todaysDrinks: number = 0;

  windowWidth: number = window.innerWidth;
  windowHeight: number = window.innerHeight;

  constructor(private dailyStorage : StorageService) {}

  ngOnInit() {
    this.loadProgress();
    console.log('Loaded values:', {
      currentProgress: this.currentProgress,
      todaysDrinks: this.todaysDrinks,
      lastDrink: this.lastDrink,
      progressPercentage: this.progressPercentage
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  // Change radius of progress circle based on screen size
  calculateRadius(): number {
    // Smaller screens
    if(this.windowWidth < 360 || this.windowHeight < 800) {
      return 70;
    // Medium screens
    } else if (this.windowWidth < 480) {
      return 100;
    } else {
      return 150;
    }
  }

  calculateStroke(): number {
    // Calculate stroke width based on radius
    const radius = this.calculateRadius();
    return Math.max(Math.floor(radius * 0.2), 15) // 15 = Minimum stroke width
  }

  async loadProgress() {
    this.currentProgress = await this.dailyStorage.get('currentProgress') || 0;
    this.todaysDrinks = await this.dailyStorage.get('todaysDrinks') || 0;
    this.lastDrink = await this.dailyStorage.get('lastDrink');
    this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100) || 0;
  }

  async addProgress(amount: number) {
    this.currentProgress += amount
    this.progressPercentage = Math.floor((this.currentProgress / this.dailyGoal) * 100);

    if (this.progressPercentage > 100) {
      this.progressPercentage = 100;
    }
    this.lastDrink = (this.getLastDrink());
    this.todaysDrinks += 1;

    await this.dailyStorage.set('lastDrink', this.lastDrink);
    await this.dailyStorage.set('todaysDrinks', this.todaysDrinks);
    await this.dailyStorage.set('currentProgress', this.currentProgress);
  }

  getLastDrink(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return (hours + ":" + minutes);
  }
}
