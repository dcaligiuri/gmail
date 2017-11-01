import { Component, ViewContainerRef } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Email } from './email.model';
import { EmailService } from './email.service';
import { Router } from "@angular/router";

@Component({
    selector: 'app-write-email',
    templateUrl: './write-email.component.html',
})
export class WriteEmailComponent {

	email: Email; 

	constructor(private emailService: EmailService, private router: Router) {}

   onSubmit(form: NgForm) {
   	
     const email = new Email(form.value.body, localStorage.getItem('loggedEmail'), form.value.to, false, form.value.subject, false, "false", new Date(), ["primary"], "false", "false");
            this.emailService.addMessage(email)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
       this.router.navigateByUrl('#');
    }


}