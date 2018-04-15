import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  ngOnInit(): void{
    // Initialize Firebase
    var config = {apiKey: "AIzaSyD4cLl_hpXBNnrfFjqHCnUMplhfhM-NHlk",
                  authDomain: "jta-instaclone-4b05c.firebaseapp.com",
                  databaseURL: "https://jta-instaclone-4b05c.firebaseio.com",
                  projectId: "jta-instaclone-4b05c",
                  storageBucket: "jta-instaclone-4b05c.appspot.com",
                  messagingSenderId: "389218387264"};
    firebase.initializeApp(config);
  }

}
