import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }            

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe((data: any) => {
      if (data.success) {
        console.log(data);
        this.authService.storeUserData(data.token, data.user);

        swal({
          type : "success",
          title : "You have successfully logged in!"
        });  

        setTimeout(function(){
          window.location.href="http://localhost:3000/music/spotifyLogin";
        },750); 
      } else {
        swal({
          type : "error",
          title : "Invalid username or password."
        }); 
        this.router.navigate(['login']);
      }
    });        
  }
}
