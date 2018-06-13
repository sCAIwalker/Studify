import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  showRain : boolean;
  showFireplace : boolean;

  constructor(private musicService: MusicService) { }

  ngOnInit() {
    this.musicService.getUserPlaylists().subscribe((data: any) => {
      console.log(data);
    });
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
