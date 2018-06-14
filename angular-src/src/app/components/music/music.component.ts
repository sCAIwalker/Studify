import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import {NgForm} from '@angular/forms';
import {UrlbypassPipe} from '../../pipes/urlbypass.pipe';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  showRain : boolean;
  showFireplace : boolean;
  playlists : any;
  playlistDisplayed : boolean = false;
  playlistSelected : boolean = false;
  selected : any;
  embedURI : any;

  constructor(private musicService: MusicService, private urlbypassPipe: UrlbypassPipe) { }

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
  }

  clickedFireplace() {
    console.log("fireplace");
    this.showRain = false;
    this.showFireplace = true;
    console.log(this.selected);
  }

  displayPlaylist() {
    this.playlistDisplayed = true;
  }

  onPlaylistSelect(playlist) {
    console.log(playlist);
    this.selected = playlist;
    this.embedURI = "https://open.spotify.com/embed?uri=" + this.selected.uri;
    this.embedURI = this.urlbypassPipe.transform(this.embedURI);
    console.log(this.embedURI);
    this.playlistDisplayed = false;
    this.playlistSelected = true;
  }
}
