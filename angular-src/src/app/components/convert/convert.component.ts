import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css']
})
export class ConvertComponent implements OnInit {
  placeholderEffects : string = "Choose Effects";
  placeholderInstruments : string = "Choose Theme";
  playlists : any;
  showRain : boolean;
  showFireplace : boolean;
  themes : any = ["Piano", "Guitar", "Cello", "Violin", "Vocal Covers"];
  selectedTheme : string;
  selected : any;
  playlistSelected : any;

  constructor(private musicService: MusicService) { }

  ngOnInit() {
    this.musicService.getUserPlaylists().subscribe((data: any) => {
      console.log(data);
      this.playlists = data;
    });
  }

  clickedRain() {
    console.log("rain");
    this.showRain = true;
    this.showFireplace = false;
    this.placeholderEffects = "Rain";
  }

  clickedFireplace() {
    console.log("fireplace");
    this.showRain = false;
    this.showFireplace = true;
    this.placeholderEffects = "Fireplace";
  }

  clickedTheme(theme) {
    console.log(theme);
    this.selectedTheme = theme;
  }

  onPlaylistSelect(playlist) {
    console.log(playlist);
    this.selected = playlist;
    this.playlistSelected = true;
  }

  convert() {
    this.musicService.getConvertedPlaylists(this.selected).subscribe((data: any) => {
      console.log(data);
    });
  }
}
