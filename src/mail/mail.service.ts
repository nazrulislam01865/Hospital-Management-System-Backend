import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { PaitentEntity } from "../patient/entities/patient.entity";
import { Appointment } from "../admin/entities/appointment.entity";


@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) {}

    async sendMail(patient: PaitentEntity, appointment : Appointment): Promise<void> {
        if(!patient.email) {
            this.logger.warn(`Patient ${patient.id} does not have an email address. Skipping email notification.`);
            return;
        }

        const appointmentDate = appointment.appointmentDate.toLocaleString('en-BD', 
            { timeZone: 'Asia/Dhaka',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
            });
        
            await this.mailerService.sendMail({
                to: patient.email,
                subject: `Appointment Confirmation - ${appointment.doctorName} on ${appointmentDate}`,
                text: `Dear ${patient.name},\n\nYour appointment with Dr. ${appointment.doctorName} has been confirmed for ${appointmentDate}.\n\nThank you for choosing our hospital.\n\nBest regards,\nHospital Management System`,
                html: `
                    <h2>Appointment Confirmation</h2>
                    <p>Dear <strong>${patient.name}</strong>,</p>
                    <p>Your appointment has been created successfully.</p>
                    <ul>
                    <li><strong>Appointment ID:</strong> ${appointment.uniqueId}</li>
                    <li><strong>Doctor:</strong> Dr. ${appointment.doctorName}</li>
                    <li><strong>Date :</strong> ${appointmentDate}</li>
                    <li><strong>Status:</strong> ${appointment.status}</li>
                    <li><strong>Payment Status:</strong> ${appointment.paymentStatus}</li>
                    </ul>
                    <p>Thank you.</p>
                `,
            });
            
    }
}
