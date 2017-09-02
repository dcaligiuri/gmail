import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Email } from './email.model';
import { EmailService } from './email.service';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styles: [
    `
    	.btn:focus { outline: none; }
        .glyphicon-star { color: gold;}
        .read-email { background-color: #F0F8FF;}
        .highlighted { background-color: #ffff99;} 
    `
    ]
   
})

export class EmailComponent {
showDropdown = false; 

@Input() message: Email;
@Input() isStarred: string;
@Input() messageId: string;
@Output() isChecked: Boolean;
@Input() isRead: string;
@Input() timeStamp: string;

    constructor(private emailService: EmailService) {
    }


    onDragStart(event: any, email: Email) {
          this.isChecked = true;
          let highlighted = this.emailService.getHighlightedEmails();
          if (highlighted.includes(email) === false){
              highlighted.push(email);
          }
          event.dataTransfer.setData('data', highlighted);
    }

    modifiedDate(){
        let today = new Date();
        let emailDate = new Date(this.timeStamp);
        if (today.getDate() === emailDate.getDate()){
            return emailDate.toLocaleTimeString();
        }
        else{
            return emailDate.toLocaleDateString();
        }
    }


    triggerUpdate(event: any){
        this.isChecked = event.target.checked;
        if (this.isChecked === true){
            this.emailService.pushHighlighted(this.message);
        }
        else if (this.isChecked === false){
            this.emailService.removeNotHighlighted(this.message);
        }
    }

    getFullNameUser(){
        return localStorage.getItem('userFirstName') + " " + localStorage.getItem('userLastName');
    }

    toggleStarred(event: any) { 

        if (this.isStarred === 'false' && event.target.classList.contains('glyphicon')){
            this.emailService.applyStar(this.messageId).subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
            event.target.classList.remove("glyphicon-star-empty");
            event.target.classList.add("glyphicon-star");
            this.isStarred = 'true';
        }
        else if (this.isStarred === 'true' && event.target.classList.contains('glyphicon')){
            this.emailService.removeStar(this.messageId).subscribe(
                    data => console.log(data),
                    error => console.log(error)
                );
            event.target.classList.remove("glyphicon-star");
            event.target.classList.add("glyphicon-star-empty");
            this.isStarred = 'false';
        }
  }

   
}

