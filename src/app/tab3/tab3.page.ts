import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonListHeader, IonItem, IonInput, IonNote } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonNote, IonInput, IonItem, IonListHeader, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, ExploreContainerComponent, IonCardHeader, IonCardTitle],
})
export class Tab3Page {
  constructor() {}
}
