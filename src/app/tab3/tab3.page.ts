import { Component } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonLabel, IonItem, IonToggle, IonSelect, IonSelectOption, IonCardTitle, IonCardHeader } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonCardHeader, IonCardTitle, IonToggle, IonItem, IonLabel, IonContent, IonCard, IonCardContent, IonSelect, IonSelectOption],
})

export class Tab3Page {
  constructor(private storageService: StorageService) {}


  clearAllData() {
    this.storageService.clear();
  }
}