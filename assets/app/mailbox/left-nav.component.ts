import {Component, Output, EventEmitter} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EmailService } from '../message/email.service';
import { Email } from '../message/email.model';

@Component({
	selector: 'app-left-side',
	templateUrl: './left-nav.component.html',
	
})


export class LeftSideComponent {
    showHide: boolean = false; 
    public messages: Email[];
 	constructor(private emailService: EmailService) {}

    lessMoreDrop(){
        this.emailService.getSpamCount();
        if (this.showHide === false){
            this.showHide = true; 
            event.target.innerHTML = "Less<i class=\"fa fa-caret-up\" aria-hidden=\"true\"></i>";
        }
        else if (this.showHide === true){
            this.showHide = false; 
            event.target.innerHTML = "More<span class='caret'></span>";
        }
    }


    test(){
        console.log(this.emailService.countInbox());
    }


    displayInboxCount(){
      return this.emailService.countInbox();
    }


    clearHighlighted(){
         this.emailService.clearHighlightedEmails();
    }

}