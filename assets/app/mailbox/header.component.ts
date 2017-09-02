import {Component, Output, EventEmitter } from "@angular/core";
import { EmailService } from "../message/email.service";
import { Router, ActivatedRoute } from "@angular/router";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Email } from '../message/email.model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',

})

export class HeaderComponent {
    @Output() passSearch = new EventEmitter<string>();
    searchBox: String = "";
    amtEmailsOnScreen: Number = 7;
    sub: any; 
    public startInboxPos: number = 1;
    public endInboxPos: number = this.amtEmailsOnScreen - this.startInboxPos + 1; 
	optionsModel: number[] = []
    myOptions: IMultiSelectOption[];
    mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
};
    
	constructor(private activatedRoute: ActivatedRoute, private router: Router, private emailService: EmailService) {}

    ngOnInit(){
        this.myOptions = [
            { id: 1, name: 'Updates' },
            { id: 2, name: 'Social' },
            { id: 3, name: 'Promotions' },
            { id: 4, name: 'Forums' },
        ];
        this.sub = this.router.events.subscribe(params => {
            this.startInboxPos = 1;
            this.endInboxPos = 7;
            this.emailService.changeLow(this.startInboxPos);
            this.emailService.changeUpp(this.endInboxPos);
        });

    }

    test(){
        console.log(this.emailService.emails);
    }

    hello(){
        console.log(this.startInboxPos);
    }

    openDropdown(){    
        let countSocial = 0; 
        let countPromotions = 0; 
        let countUpdates = 0;
        let countForums = 0; 
        for (let higlightedEmails of this.emailService.getHighlightedEmails()) {
            if (higlightedEmails.labels.includes("social")){
                countSocial++; 
            }
            if(higlightedEmails.labels.includes("promotions")){
                countPromotions++;
            }
            if(higlightedEmails.labels.includes("updates")){
                countUpdates++;
            }
            if(higlightedEmails.labels.includes("forums")){
                countForums++;
            }
        }
        if (this.emailService.getHighlightedEmails().length === countSocial){
           this.optionsModel = [2];
        }
        //console.log(countSocial);
        //console.log(countPromotions);
        //console.log(countForums);
        //console.log(countUpdates);
    }



   changeLabelHighlighted(){
       let selected = [];
        for (let higlightedEmails of this.optionsModel) {
            selected.push(this.myOptions[higlightedEmails - 1].name.toLowerCase());
        }
        this.emailService.changeLabelHighlightedEmails(selected).subscribe(
                data => {
                    },
                    error => console.error(error)
            );
    }

    //onChange(){
    //}

    getRangeEmails(){
        let displayEndPos = this.endInboxPos;
        let displayStartPos = this.startInboxPos;
        if (this.displayCurrentComponentEmailsCount() === 0){
            displayStartPos = 0; 
        }
        if (this.endInboxPos > this.displayCurrentComponentEmailsCount()){
            displayEndPos = this.displayCurrentComponentEmailsCount();
        }
        return displayStartPos.toString() + '-' + displayEndPos.toString();
    }

    updateSearchHeader(event: any){
        this.searchBox = event; 
    }

    getLimit(){
        return this.amtEmailsOnScreen;
    }

    getSkip(){
        if (this.startInboxPos = 1){
            return 0;
        }
        else {
            return this.amtEmailsOnScreen + this.startInboxPos;
        }
    }

    incrementUp(){
        if (this.startInboxPos + 7 <= this.emailService.countCurrentComponentEmails()){

        this.startInboxPos = this.startInboxPos + 7;
        this.endInboxPos = this.endInboxPos + 7;
        this.emailService.changeLow(this.startInboxPos);
        this.emailService.changeUpp(this.endInboxPos);


        }

       
    }

    incrementDown(){
        if (this.startInboxPos > 1){
            this.startInboxPos = this.startInboxPos - 7; 
            this.endInboxPos = this.endInboxPos - 7; 
            this.emailService.changeLow(this.startInboxPos);
            this.emailService.changeUpp(this.endInboxPos);
        }
    }

    displayCurrentComponentEmailsCount(){
      return this.emailService.countCurrentComponentEmails();
    }

    markAllRead(){
        this.emailService.markAllRead().subscribe(
                data => {
                    },
                    error => console.error(error)
            );
    }

    moveTo(placeToMove: string){
        let originalLocation = this.activatedRoute.snapshot.firstChild.url[2].path 
        this.emailService.moveEmail(placeToMove, originalLocation).subscribe(
                data => {
                    },
                error => console.error(error)
           );
    }
    
    trashHighlightedMess(){
    	this.emailService.trashHighlightedEmails().subscribe(
    			data => {
                    },
                    error => console.error(error)
            );
    }


    markHighlightedRead(){
        this.emailService.markReadHighlighted().subscribe(
                data => {
                    },
                    error => console.error(error)
            );
        this.emailService.getMessages('inbox').subscribe(
                        (messages: Email[]) => {
                            this.emailService.emails = messages;
                        }
                    );
        this.emailService.clearHighlightedEmails();
    }


    markHighlightedSpam(){
        console.log("YOU HAVE CLICKED REPORT SPAM");
        this.emailService.markSpamHighlighted().subscribe(
                data => {
                    },
                    error => console.error(error)
            );
    }

    markHighlightedNotSpam(){
        this.emailService.markNotSpamHighlighted().subscribe(
                data => {
                    },
                    error => console.error(error)
            );
    }


    markHighlightedUnread(){
        this.emailService.markUnreadHighlighted().subscribe(
                data => {

                    },
                    error => console.error(error)
            );
    }

    starHighlighted(){
        this.emailService.starHighlightedEmails().subscribe(
                data => {

                    },
                    error => console.error(error)
            );
    }

    onSelected(){
    	return this.emailService.highlighted();
    }



    readSelected(){
        return this.emailService.checkHighlightedForRead();
    }

    unreadSelected(){
        return this.emailService.checkHighlightedForUnread();
    }

    logout(){
        localStorage.clear();
        this.emailService.highlightedEmails = [];
        this.router.navigateByUrl('/');
    }


}