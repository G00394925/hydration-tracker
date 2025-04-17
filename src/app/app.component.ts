import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}

  ngOnInit() {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js').then(() => {
        console.log('Service Worker registered successfully');
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }
}
