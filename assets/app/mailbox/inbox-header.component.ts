import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EmailService } from "../message/email.service";

@Component({
	selector: 'app-inbox-header',
	templateUrl: './inbox-header.component.html'
})


export class InboxHeaderComponent {

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private emailService: EmailService) {}


	moveTo(placeToMove: string){
        let originalLocation = this.activatedRoute.snapshot.url[2].path;
        let currTab = this.emailService.getCurrentTab();
        this.emailService.moveEmail(placeToMove, originalLocation).subscribe();
        this.emailService.getMessages(currTab).subscribe();
    }

	onDrop(event: any, data: any){
		let dataTransfer = event.dataTransfer.getData('data');
		let targetTab = event.srcElement.id;
		this.moveTo(targetTab);
  		event.preventDefault();
  		this.emailService.clearHighlightedEmails();
	}

	allowDrop(event: any) {
  		event.preventDefault();
	}



}

