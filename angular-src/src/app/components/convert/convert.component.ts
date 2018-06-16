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
  placeholderPlaylists : string = "Choose Playlist";
  playlists : any;
  showRain : boolean;
  showFireplace : boolean;
  themes : any = ["Piano", "Guitar", "Cello", "Violin", "Vocal Covers"];
  selectedTheme : string;
  selected : any;
  playlistSelected : any;
  songsToConvert : any;
  selectedRow : Number;

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
    this.placeholderInstruments = theme
  }

  onPlaylistSelect(playlist) {
    console.log(playlist);
    this.selected = playlist;
    this.placeholderPlaylists = playlist.name;
  }

  convert() {
    this.selected["theme"] = this.selectedTheme;
    console.log(this.selected);
    this.musicService.getConvertedPlaylists(this.selected).subscribe((data: any) => {
      this.songsToConvert = data;
      this.playlistSelected = true;
      console.log(this.songsToConvert);
    });
  }

  onSongSelect(song, index) {
    console.log(song.name);
    this.selectedRow = index;
  }
}
