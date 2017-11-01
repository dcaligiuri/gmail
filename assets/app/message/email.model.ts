export class Email {
    constructor(public content: string,
                public fromEmail: string,
                public toEmail: string,
                public starred: boolean,
                public subject: string,
                public read: boolean,
                public spam: string,
                public timeStamp: object,
                public labels: object,
                public trash: string,
                public isChecked: boolean, 
                public messageId?: string,
                public userId?: string
                ) {}
}