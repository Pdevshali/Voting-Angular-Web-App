import { DatePipe } from "@angular/common";
import { timestamp } from "rxjs";

export interface OptionVote{
    optionText: string;
    voteCount: number;
}

export interface Poll {
    id: number;
    question: string;
    options: OptionVote[];
}



export interface AuditLog{

    id: number;
    action : string;
    pollId : number;
    timestamp : string;
}
