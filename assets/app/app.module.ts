import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./mailbox/header.component";
import { EmailListComponent } from "./message/email-list.component";
import { LeftSideComponent } from "./mailbox/left-nav.component";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { InboxHeaderComponent } from "./mailbox/inbox-header.component";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { WriteEmailComponent } from "./message/write-email.component";
import { EmailService } from "./message/email.service";
import { Http, Response, Headers, HttpModule } from "@angular/http";
import {ContextMenuModule} from 'ngx-contextmenu';
import { ReadEmailComponent } from "./message/read-email.component";
import { EmailComponent } from "./message/email.component";
import { MyContextMenuClass } from "./message/test.component";
import { LoginComponent } from "./user/login.component";
import { UserService } from "./user/user.service";
import { SignupComponent } from "./user/signup.component";
import { AutocompleteComponent } from "./message/autocomplete.component";
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
  {path: 'mail/inbox/primary', component: EmailListComponent },
  {path: 'mail/inbox/primary/:id', component: ReadEmailComponent },
  {path: 'mail/inbox/social', component: EmailListComponent },
  {path: 'mail/inbox/social/:id', component: ReadEmailComponent },
  {path: 'mail/inbox/promotions', component: EmailListComponent },
  {path: 'mail/inbox/promotions/:id', component: ReadEmailComponent },
  {path: 'mail/inbox/updates', component: EmailListComponent },
  {path: 'mail/inbox/updates/:id', component: ReadEmailComponent },
  {path: 'mail/inbox/forums', component: EmailListComponent },
  {path: 'mail/inbox/forums/:id', component: ReadEmailComponent },
  {path: 'mail/inbox/:id', component: ReadEmailComponent},
  {path: 'mail/compose', component: WriteEmailComponent},
  {path: 'mail/starred/:id', component: ReadEmailComponent},
  {path: 'mail/starred', component: EmailListComponent},
  {path: 'mail/sent', component: EmailListComponent},
  {path: 'mail/sent/:id', component: ReadEmailComponent},
  {path: 'mail/spam', component: EmailListComponent},
  {path: 'mail/trash/:id', component: ReadEmailComponent},
  {path: 'mail/trash', component: EmailListComponent},
  {path: 'mail/all/:id', component: ReadEmailComponent},
  {path: 'mail/all', component: EmailListComponent},
  {path: 'mail/spam/:id', component: ReadEmailComponent},
  {path: 'mail/search', component: EmailListComponent},
  {path: 'mail/search/:searchTerm', component: EmailListComponent},
  {path: 'user/signup', component: SignupComponent},
  {path: ':id', component: ReadEmailComponent},
  {path: '', component: LoginComponent},
];

@NgModule({
    declarations: [
        AppComponent, AutocompleteComponent, MyContextMenuClass, SignupComponent, LoginComponent, EmailComponent, HeaderComponent, EmailListComponent, LeftSideComponent, InboxHeaderComponent, WriteEmailComponent, ReadEmailComponent
    ],
    imports: [BrowserModule, ReactiveFormsModule, MultiselectDropdownModule, Ng2CompleterModule, ContextMenuModule, RouterModule.forRoot(appRoutes), FormsModule, HttpModule, BsDropdownModule.forRoot() ],
    providers: [EmailService, UserService],
    bootstrap: [AppComponent]
})



export class AppModule {

}



