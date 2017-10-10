import { Component } from '@angular/core';
import { User } from './user.model';
import { UserService } from './user.service';
import {NgForm} from '@angular/forms';
import { Router } from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styles: [
    `
    	.btn:focus {
  			outline: none;
		}

    `
    ]
   
})
export class SignupComponent {
user: User;


    constructor(private userService: UserService, private router: Router) {}


   onSubmit(form: NgForm) {
       
     const user = new User(form.value.email, form.value.password, form.value.firstName, form.value.lastName);
            this.userService.signup(user)
               .subscribe(
                    data => {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.userId);
                        localStorage.setItem('loggedEmail', data.loggedEmail);
                        localStorage.setItem('userFirstName', data.firstName);
                        localStorage.setItem('userLastName', data.lastName);
                        this.router.navigateByUrl('/mail/inbox/primary');
                    },
                    error => console.error(error)
                    )
    }

}

