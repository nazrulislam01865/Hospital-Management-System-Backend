import { IsDateString, IsOptional } from "class-validator";

export class BillingReportDto {
    @IsOptional()
    @IsDateString({}, { message: 'Please provide a valid start date' })
    startDate?: string;
    
    @IsOptional()
    @IsDateString({}, { message: 'Please provide a valid end date' })
    endDate?: string;
}