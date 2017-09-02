import { Component, ViewContainerRef, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Email } from './email.model';
import { EmailService } from './email.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-read-email',
    templateUrl: './read-email.component.html',
})
export class ReadEmailComponent implements OnInit {

  public email: Email = new Email('', '', '', false, '', false, 'false', new Date(), ["primary"], "false");
	id: string;
  private sub: any;


	constructor(private route: ActivatedRoute, public emailService: EmailService) {



  }

	  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id']; 
       this.emailService.readMessage(this.id)
         .subscribe(result => this.email = result);
    });

    

    //only mark as read if unread 
    //fix this eventually 


  //this.emailService.markAsRead(this.id)
      //.subscribe(result => this.email = result);


    
     





	}
}






  