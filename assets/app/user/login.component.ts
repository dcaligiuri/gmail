import { Component } from '@angular/core';
import { User } from './user.model';
import { UserService } from './user.service';
import {NgForm} from '@angular/forms';
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
    `
    	.btn:focus {outline: none;}

    `
    ]
   
})


export class LoginComponent {

    firstName: String; 

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {
          if(localStorage.getItem('token')){
              this.router.navigateByUrl('/mail/inbox/primary');
          }
    }

    onChange(event: any){
        this.userService.sayHi(event)
                .subscribe(
                    result => {
                        this.firstName = result.firstName;
                    },
                    error => console.error(error)
                );
    }

    onSubmit(form: NgForm) {
        const user = new User(form.value.email, form.value.password);
            this.userService.submitLogin(user)
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
                );
    }

    sendMessage(){
        alert("Try 'dan@gmail.com' and 'password'");
    }

}

