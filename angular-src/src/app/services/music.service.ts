import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) { }

  getUserPlaylists() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get('http://localhost:3000/music/userPlaylist', {headers: headers}).pipe(map(res => res));
  }
  
  getConvertedPlaylists(playlist) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('http://localhost:3000/music/convert', playlist, {headers: headers}).pipe(map(res => res)); 
  }

  getConvertedID(song) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('http://localhost:3000/music/id', song, {headers: headers}).pipe(map(res => res)); 
  }
}
