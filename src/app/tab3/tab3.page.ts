import { Component } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonLabel, IonItem, IonToggle, IonSelect, IonSelectOption, IonCardTitle, IonCardHeader, IonIcon } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonIcon, IonCardHeader, IonCardTitle, IonToggle, IonItem, IonLabel, IonContent, IonCard, IonCardContent, IonSelect, IonSelectOption],
})

export class Tab3Page {
  constructor(private storageService: StorageService) {}

  resetProgress() {
    this.storageService.set('currentProgress', 0);
    this.storageService.set('todaysDrinks', 0);
    this.storageService.set('lastDrink', '');
  }

  clearAllData() {
    this.storageService.clear();
  }
}