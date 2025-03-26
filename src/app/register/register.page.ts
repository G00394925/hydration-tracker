import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonList, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonItem, IonList, IonButton]
})

export class RegisterPage implements OnInit {
  // User input fields
  email: string = '';
  confirmEmail: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  // Verify that the user input is valid
  verifyAccount(): boolean {
    // Details do not match
    if(this.email !== this.confirmEmail) {
      console.error('Emails do not match');
      return false;
    }

    if(this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return false;
    }

    // Details are left blank
    if(this.email === '' || this.confirmEmail === '' || this.password === '' || this.confirmPassword === '') {
      console.error('Please fill out all fields');
      return false;
    }

    return true;
  }

  createAccount() {
    if(this.verifyAccount()) {
      console.log('Account created');
      this.navCtrl.navigateForward('/tabs/tab1');
    }
  }
}
