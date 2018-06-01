import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  helper = new JwtHelperService();

  constructor(private http:HttpClient) { }

  registerUser(user) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('http://localhost:3000/users/register', user, {headers: headers}).pipe(map(res => res));
  }

  authenticateUser(user) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers}).pipe(map(res => res));
  }

  getProfile() {
    this.loadToken();
    console.log(this.authToken);
    let headers = new HttpHeaders({
      'Authorization': this.authToken,
      'Content-Type': 'application/json'
    });
    return this.http.get('http://localhost:3000/users/profile', {headers: headers}).pipe(map(res => res));
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = "JWT " + token.substring(3, token.length);
  }

  loggedIn() {
    return !this.helper.isTokenExpired(localStorage.getItem("id_token"));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear()
  }
}
