import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonLabel, IonItem, IonToggle, IonSelect, IonSelectOption, IonCardTitle, IonCardHeader, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonFooter, IonCardHeader, IonCardTitle, IonToggle, IonItem, IonLabel, IonContent, IonCard, IonCardContent, IonSelect, IonSelectOption],
})

export class Tab3Page implements OnInit {
  dailyGoal: number = 2000; // Default daily goal

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    const savedGoal = await this.storageService.get('dailyGoal');
    
    if (savedGoal) {
      this.dailyGoal = savedGoal;
    }
  }

  resetProgress() {
    this.storageService.set('currentProgress', 0);
    this.storageService.set('todaysDrinks', 0);
    this.storageService.set('lastDrink', '');
  }

  clearAllData() {
    this.storageService.clear();
  }

  updateGoal(event: any) {
    // Extract value from the event
    const newGoal = event.detail.value;

    // Update the daily goal
    this.dailyGoal = newGoal;

    // Save the new goal to storage
    this.storageService.set('dailyGoal', newGoal);
  }
}