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

  player: YT.Player;
  private ytEvent;
  private id: string;

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
    this.musicService.getConvertedPlaylists(this.selected).subscribe((data: any) => {
      this.songsToConvert = data;
      this.playlistSelected = true;
      console.log(this.songsToConvert);
    });
  }

  convert() {
    this.selected["theme"] = this.selectedTheme;
    console.log(this.selected);
  }

  onSongSelect(song, index) {
    console.log(song.name);
    this.selectedRow = index;
    song["theme"] = this.selectedTheme;
    this.musicService.getConvertedID(song).subscribe((data: any) => {
      this.id = data[0].videoId;
      console.log(this.id);
      console.log(this.player);
      this.player.loadVideoById(this.id); //loads the video and plays it.
      // this.player.curVideoById(this.id); loads the video but doesn't play it.
      // this.player.playVideo();
    });
  }

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }

  onStateChange(event) {
    this.ytEvent = event.data;
  }
}
