import {Component, Output, EventEmitter } from "@angular/core";
import { EmailService } from "../message/email.service";
import { Router, ActivatedRoute } from "@angular/router";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Email } from '../message/email.model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})

export class HeaderComponent {
    @Output() passSearch = new EventEmitter<string>();
    searchBox: String = "";
    amtEmailsOnScreen: number = 13;
    sub: any;
    any: any;  
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
            this.endInboxPos = this.amtEmailsOnScreen;
            this.emailService.changeLow(this.startInboxPos);
            this.emailService.changeUpp(this.endInboxPos);
        });


        //this.any = this.activatedRoute.url.subscribe(params => {
            //console.log(params);
        //});
        
    }


    refresh(): void {
        window.location.reload();
    }

    outputSerEmails(){
        console.log(this.emailService.emails);
    }




    showEmailsInService(){
        //console.log(this.emailService.emails);
    }
    showHighlightedEmailsInService(){
        //console.log(this.emailService.highlightedEmails);
    }

    delHighlighted(){
        let currTab = this.emailService.getCurrentTab();
        this.emailService.deleteHighlighted(currTab).subscribe();
    }

    onTrashTab(){
        let currTab = this.emailService.getCurrentTab();
        if (currTab === 'trash'){
            return true; 
        }
        return false; 
    }


    changeThickness(event: any, thickness: string){
        this.emailService.changeThickness(thickness);
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




    highlightAll(){
        for (let x = this.startInboxPos - 1; x < this.endInboxPos; x++){
            if (this.emailService.emails[x] !== undefined){
                this.emailService.emails[x].isChecked = true;
                this.emailService.highlightedEmails.push(this.emailService.emails[x]);
            }
        }
    }


    highlightRead(){
        for (let x = this.startInboxPos - 1; x < this.endInboxPos; x++){
            this.emailService.removeNotHighlighted(this.emailService.emails[x]);
            if (this.emailService.emails[x] !== undefined && this.emailService.emails[x].read === 'true' ){
                this.emailService.emails[x].isChecked = true;
                this.emailService.highlightedEmails.push(this.emailService.emails[x]);
            }
        }
    }


    highlightNone(){
        for (let x = this.startInboxPos - 1; x < this.endInboxPos; x++){
            if (this.emailService.emails[x] !== undefined){
                this.emailService.emails[x].isChecked = false;
                this.emailService.removeNotHighlighted(this.emailService.emails[x]);
            }
        }
    }


    highlightUnread(){
        for (let x = this.startInboxPos - 1; x < this.endInboxPos; x++){
            this.emailService.removeNotHighlighted(this.emailService.emails[x]);
            if (this.emailService.emails[x] !== undefined && this.emailService.emails[x].read === 'false' ){
                this.emailService.emails[x].isChecked = true;
                this.emailService.highlightedEmails.push(this.emailService.emails[x]);
            }
        }
    }

    highlightStarred(){
        for (let x = this.startInboxPos - 1; x < this.endInboxPos; x++){
            if (this.emailService.emails[x] !== undefined && this.emailService.emails[x].starred === 'true' ){
                this.emailService.emails[x].isChecked = true;
                this.emailService.highlightedEmails.push(this.emailService.emails[x]);
            }
        }
    }


    highlightUnstarred(){
        for (let x = this.startInboxPos - 1; x < this.endInboxPos; x++){
            if (this.emailService.emails[x] !== undefined && this.emailService.emails[x].starred === 'false' ){
                this.emailService.emails[x].isChecked = true;
                this.emailService.highlightedEmails.push(this.emailService.emails[x]);
            }
        }
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

    //getLimit(){
    //    return this.amtEmailsOnScreen;
    //}

    //getSkip(){
       /// if (this.startInboxPos = 1){
      //      return 0;
      ///  }
      //  else {
      //      return this.amtEmailsOnScreen + this.startInboxPos;
     //   }
    ///}

    incrementUp(){
        if (this.startInboxPos + this.amtEmailsOnScreen <= this.emailService.countCurrentComponentEmails()){
            this.startInboxPos = this.startInboxPos + this.amtEmailsOnScreen;
            this.endInboxPos = this.endInboxPos + this.amtEmailsOnScreen;
            this.emailService.changeLow(this.startInboxPos);
            this.emailService.changeUpp(this.endInboxPos);


        }

       
    }

    incrementDown(){
        if (this.startInboxPos > 1){
            this.startInboxPos = this.startInboxPos - this.amtEmailsOnScreen; 
            this.endInboxPos = this.endInboxPos - this.amtEmailsOnScreen; 
            this.emailService.changeLow(this.startInboxPos);
            this.emailService.changeUpp(this.endInboxPos);
        }
    }

    displayCurrentComponentEmailsCount(){
      return this.emailService.countCurrentComponentEmails();
    }

    markAllRead(){
        let currTab = this.emailService.getCurrentTab();
        this.emailService.markAllRead().subscribe();
        //this.emailService.getMessages(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
        
    }

    moveTo(placeToMove: string){
        let currTab = this.emailService.getCurrentTab();
        let originalLocation = this.activatedRoute.snapshot.firstChild.url[2].path 
        this.emailService.moveEmail(placeToMove, originalLocation).subscribe();
        this.emailService.getMessages(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
    }



    
    trashHighlightedMess(){
        let currTab = this.emailService.getCurrentTab();
    	this.emailService.trashHighlightedEmails(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
    }

    
    markHighlightedSpam(){
        let currTab = this.emailService.getCurrentTab();
        this.emailService.markSpamHighlighted(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
    }

    markHighlightedNotSpam(){
        this.emailService.markNotSpamHighlighted().subscribe(
                data => {
                    },
                    error => console.error(error)
            );
    }



    markHighlightedRead(){
        let currTab = this.emailService.getCurrentTab();
        //console.log(currTab);
        this.emailService.markReadHighlighted(currTab).subscribe();

        //this.emailService.getMessages(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
    }


    markHighlightedUnread(){
        let currTab = this.emailService.getCurrentTab();
        //console.log(currTab);
        this.emailService.markUnreadHighlighted(currTab).subscribe();
        //this.emailService.getMessages(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
    }

    starHighlighted(){
        let currTab = this.emailService.getCurrentTab();
        this.emailService.starHighlightedEmails().subscribe();
        //this.emailService.getMessages(currTab).subscribe();
        this.emailService.clearHighlightedEmails();
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