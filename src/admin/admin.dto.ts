import { IsNotEmpty } from "class-validator";
export class AdminDTO{
    @IsNotEmpty()
    name: string;
    uname: string;
    password: string;
}
