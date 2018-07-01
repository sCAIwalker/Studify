import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  spotifyAccount: String;

  constructor(private validateService: ValidateService, private flashMessage: FlashMessagesService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      spotifyAccount: this.spotifyAccount 
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)) {
      swal({
        type : "error",
        title : "Please fill in all the fields."
      }); 
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)) {
      swal({
        type : "error",
        title : "Please use a valid email."
      }); 
      return false;
    }

    //Register User
    this.authService.registerUser(user).subscribe((data: any)=> {
      if (data.success) {
        swal({
          type : "success",
          title : "You are registered and can now login!"
        }); 
        this.router.navigate(['/login']);
      } else{
        swal({
          type : "error",
          title : "An error occurred."
        }); 
        this.router.navigate(['/register']);
      }
    });
  }

}
