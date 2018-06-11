import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  showRain : boolean;
  showFireplace : boolean;
  constructor() { }

  ngOnInit() {

  }

  clickedRain() {
    console.log("rain");
    this.showRain = true;
    this.showFireplace = false;
  }

  clickedFireplace() {
    console.log("fireplace");
    this.showRain = false;
    this.showFireplace = true;
  }
}
