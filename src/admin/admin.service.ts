import { BadRequestException, Body, Injectable, NotFoundException } from "@nestjs/common";
import { DoctorDto } from "../doctor/doctor.dto";
import { PatientDto } from "../patient/patient.dto";
import { AdminDTO } from "./admin.dto";
import { AppointmentDto } from "./dto/appointment.dto";
import { BillDto } from "./dto/bill.dto";
import { RoomDto } from "./dto/room.dto";
import { ServiceChargeDto } from "./dto/service-charge.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.entity";
import { AdminEntity } from "./entities/admin.entity";
import { BillEntity } from "./entities/bill.entity";
import { RoomEntity } from "./entities/room.entity";
import { PaitentEntity } from "../patient/entities/patient.entity";
import * as bcrypt from 'bcryptjs';
import { MailService } from "../mail/mail.service";

@Injectable()
export class AdminService {

    constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(BillEntity)
    private readonly billRepo: Repository<BillEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(PaitentEntity)
    private readonly patientRepo: Repository<PaitentEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
    private readonly mailService: MailService,
    ) {}


    //Admin services
    async getAdminById(id: number): Promise<object> {
        const admin = await this.adminRepo.findOne( {where: { id }});
        if(!admin){
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
        
        return {message: `Admin with id ${id} retrieved successfully`,
        data:{
            adminId: admin.id,
            uname: admin.uname,
            name: admin.name,
            email: admin.email,
            dateOfBirth: admin.dateOfBirth,
            socialMediaLinks: admin.socialMediaLinks,
        }
        };
    }

    async updateAdmin(id: number, data: AdminDTO) {
        const exAdmin = await this.adminRepo.findOne({ where: { id } });
        
        if (!exAdmin) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }

        const duplicateAdmin = await this.adminRepo.findOne({
            where: [
                { email: data.email },
                { uname: data.uname },
            ],
        });

        if (duplicateAdmin) {
            throw new BadRequestException('Admin with the same email or username already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        exAdmin.name = data.name;
        exAdmin.email = data.email;
        exAdmin.uname = data.uname;
        exAdmin.password = hashedPassword;
        exAdmin.dateOfBirth = data.dateOfBirth;
        exAdmin.socialMediaLinks = data.socialMediaLinks;

        const updateAdmin = await this.adminRepo.save(exAdmin);
        
        return {
            message: `Admin with id ${id} updated successfully`,
            data: {
                adminId: updateAdmin.id,
                name: updateAdmin.name,
                email: updateAdmin.email,
                dateOfBirth: updateAdmin.dateOfBirth,
                socialMediaLinks: updateAdmin.socialMediaLinks,
            },
        };

    }

    async deleteAdmin(id: number): Promise<object> {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (!admin) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
        await this.adminRepo.remove(admin);
        return { message: `Admin with id ${id} deleted successfully` };
    }

    async getAllAdmins(): Promise<object> { 
        const admins = await this.adminRepo.find();
        return {
            message: 'All admins retrieved successfully',
            data: admins.map((admin) => ({
                adminId: admin.id,
                name: admin.name,
                email: admin.email,
                dateOfBirth: admin.dateOfBirth,
                socialMediaLinks: admin.socialMediaLinks,
            })),
        };
    }



    //Patient Management

    async getAllPatients() {
        const patients = await this.patientRepo.find({ order: { id: 'ASC' } });

        return {
        message: 'All patients retrieved successfully',
        data: patients,
        };
    }

    async getPatientById(id: number) {
        const patient = await this.patientRepo.findOne({ where: { id } });

        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        return {
            message: `Patient with id ${id} retrieved successfully`,
            data: {
            id: patient.id,
            uniqueId: patient.uniqueId,
            name: patient.name,
            dateOfBirth: patient.dateOfBirth,
            socialMediaLinks: patient.socialMediaLinks,
            },
        };
    }

    async createPatient(data: PatientDto): Promise<object> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const patient = this.patientRepo.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            dateOfBirth: data.dateOfBirth,
            socialMediaLinks: data.socialMediaLinks,
        });
        await this.patientRepo.save(patient);
        return { message: 'Patient created successfully', data: patient };
    }

    async deletePatient(id: number) {
        const patient = await this.patientRepo.findOne({ where: { id } });

        if (!patient) {
        throw new NotFoundException('Patient not found');
        }

        await this.patientRepo.remove(patient);

        return {
        message: `Patient with id ${id} deleted successfully`,
        };
    }


    async updatePatients(id: number, data: PatientDto) {
        const patient = await this.patientRepo.findOne({ where: { id } });

        if (!patient) {
        throw new NotFoundException('Patient not found');
        }

        patient.name = data.name;
        patient.email = data.email;
        patient.password = await bcrypt.hash(data.password, 10);
        patient.dateOfBirth = data.dateOfBirth;
        patient.socialMediaLinks = data.socialMediaLinks;

        const updatedPatient = await this.patientRepo.save(patient);

        return {
        message: `Patient with id ${id} updated successfully`,
        data: [
            updatedPatient.id,
            updatedPatient.name,
            updatedPatient.email,
            updatedPatient.dateOfBirth,
            updatedPatient.socialMediaLinks,
        ],
        };
    }




    //Appointment Management

    async getAllAppointments() {
        const appointments = await this.appointmentRepo.find({relations: ['patient', 'admin', 'bill'],order: { id: 'ASC' },
        });
        return {
            message: 'All appointments retrieved successfully',
            data: appointments,
        };
    }
    
    async getAppointmentById(id: number) {
        const appointment = await this.appointmentRepo.findOne({ where: { id },relations: ['patient', 'admin', 'bill'], });
        
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        return {
            message: `Appointment with id ${id} retrieved successfully`,
            data: [
                appointment.id,
                appointment.patient.name,
                appointment.doctorName,
                appointment.appointmentDate,
                appointment.paymentStatus,
            ],
        };
    }


    async createAppointment(adminId: number,data: AppointmentDto): Promise<object> {

        const admin = await this.adminRepo.findOne({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        const patient = await this.patientRepo.findOne({
            where: { id: data.patientId },
        });

        if (!patient) {
            throw new NotFoundException(`Patient with id ${data.patientId} not found`);
        }

        const appointment = this.appointmentRepo.create({
            patient,
            doctorName: data.doctorName,
            appointmentDate: data.appointmentDate
            ? new Date(data.appointmentDate)
            : new Date(),
            status: 'Pending',
            paymentStatus: 'Unpaid',
            admin,
        });

        const create= await this.appointmentRepo.save(appointment);
        let emailNotification = 'sent';

        try {
            await this.mailService.sendMail(patient, create);
        } catch (error) {
            emailNotification = 'failed';
            console.error('Appointment email sending failed:', error);
        }

        return {
            message: 'Appointment created successfully',
            emailNotification,
            data: [
                create.id,
                create.patient.name,
                create.doctorName,
                create.appointmentDate,
                create.paymentStatus,
                create.status,
                create.admin.name
            ],
        }

    }


    async updateAppointment(id: number, data: AppointmentDto) {
        const appointment = await this.appointmentRepo.findOne({
            where: { id },
            relations: ['patient'],
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        if (data.patientId !== undefined) {
            const patient = await this.patientRepo.findOne({
            where: { id: data.patientId },
            });

            if (!patient) {
            throw new NotFoundException(`Patient with id ${data.patientId} not found`);
            }

            appointment.patient = patient;
        }

        appointment.doctorName = data.doctorName;
        appointment.appointmentDate = data.appointmentDate
            ? new Date(data.appointmentDate)
            : appointment.appointmentDate;

        const updatedAppointment = await this.appointmentRepo.save(appointment);

        const fullAppointment = await this.appointmentRepo.findOne({
            where: { id: updatedAppointment.id },
            relations: ['patient', 'admin', 'bill'],
        });

        return {
            message: `Appointment with id ${id} updated successfully`,
            data: fullAppointment,
        };
    }

    async deleteAppointment(id: number) {
        const appointment = await this.appointmentRepo.findOne({ where: { id } });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        await this.appointmentRepo.remove(appointment);

        return {
            message: `Appointment with id ${id} deleted successfully`,
        };
    }


    async getAppointmentsByDate(date: string) {
        const appointments = await this.appointmentRepo
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.admin', 'admin')
            .leftJoinAndSelect('appointment.bill', 'bill')
            .where('DATE(appointment.appointmentDate) = :date', { date })
            .getMany();

        return {
            message: `Appointments for ${date} retrieved successfully`,
            data: appointments,
        };
    }

        async getUnpaidAppointments() {
        const appointments = await this.appointmentRepo.find({
            where: { paymentStatus: 'Unpaid' },
            relations: ['patient', 'admin', 'bill'],
            order: { id: 'ASC' },
        });

        return {
            message: 'Unpaid appointments retrieved successfully',
            data: appointments,
        };
        }


    async approveAppointment(id: number) {
        const appointment = await this.appointmentRepo.findOne({ where: { id } });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        appointment.status = 'Approved';
        const updatedAppointment = await this.appointmentRepo.save(appointment);

        return {
            message: `Appointment with id ${id} approved successfully`,
            data: updatedAppointment,
        };
    }


    async cancelAppointment(id: number) {
        const appointment = await this.appointmentRepo.findOne({ where: { id } });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        appointment.status = 'Cancelled';
        const updatedAppointment = await this.appointmentRepo.save(appointment);

        return {
            message: `Appointment with id ${id} cancelled successfully`,
            data: updatedAppointment,
        };
    }



 





    // Billing Management

    async getAllBills() {
        const bills = await this.billRepo.find({
            relations: ['admin', 'appointment', 'appointment.patient'],
            order: { id: 'ASC' },
        });

        return {
            message: 'All bills retrieved successfully',
            data: bills.map((bill) => ({
            id: bill.id,
            patientName: bill.patientName,
            serviceCharge: bill.serviceCharge,
            billingDate: bill.billingDate,
            status: bill.status,
            paymentDate: bill.paymentDate,
            createdAt: bill.createdAt,
            admin: bill.admin
                ? {
                    name: bill.admin.name,
                    email: bill.admin.email,
                }
                : null,
            appointment: bill.appointment
                ? {
                    patient: bill.appointment.patient
                    ? {
                        id: bill.appointment.patient.id,
                        name: bill.appointment.patient.name,
                        email: bill.appointment.patient.email,
                        socialMediaLinks: bill.appointment.patient.socialMediaLinks,
                        }
                    : null,
                    doctorName: bill.appointment.doctorName,
                    appointmentDate: bill.appointment.appointmentDate,
                    status: bill.appointment.status,
                    paymentStatus: bill.appointment.paymentStatus,
                }
                : null,
            })),
        };
    }


    async createBill(adminId: number, data: BillDto) {
        const admin = await this.adminRepo.findOne({ where: { id: adminId } });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        let appointment: Appointment | null = null;

        if (data.appointmentId) {
            appointment = await this.appointmentRepo.findOne({
            where: { id: data.appointmentId },relations: ['bill', 'patient'],});

            if (!appointment) {
                throw new NotFoundException('Appointment not found');
            }

            if (appointment.bill) {
                throw new BadRequestException('This appointment already has a bill');
            }

            if (data.patientName !== appointment.patient?.name) {
                throw new BadRequestException('Patient name does not match the appointment patient');
            }
        }

        const bill = this.billRepo.create({
            patientName: data.patientName,
            serviceCharge: data.serviceCharge,
            billingDate: data.billingDate,
            status: 'Unpaid',
            admin,
            appointment: appointment || undefined,
        });

        const savedBill = await this.billRepo.save(bill);

        const fullBill = await this.billRepo.findOne({
            where: { id: savedBill.id },
            relations: ['admin', 'appointment', 'appointment.patient'],
        });

        return {
            message: 'Bill created successfully',
            data: fullBill,
        };
    }

    async getBillById(id: number) {
        const bill = await this.billRepo.findOne({
            where: { id },
            relations: ['admin', 'appointment', 'appointment.patient'],
        });

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        return {
            message: `Bill with id ${id} retrieved successfully`,
            data: {
            id: bill.id,
            uniqueId: bill.uniqueId,
            patientName: bill.patientName,
            serviceCharge: bill.serviceCharge,
            billingDate: bill.billingDate,
            status: bill.status,
            paymentDate: bill.paymentDate,
            createdAt: bill.createdAt,
            admin: bill.admin
                ? {
                    id: bill.admin.id,
                    // name: bill.admin.name,
                    // uname: bill.admin.uname,
                    // email: bill.admin.email,
                }: null,
            appointment: bill.appointment
                ? {
                    id: bill.appointment.id,
                    // patientName: bill.appointment.patient.name,
                    // doctorName: bill.appointment.doctorName,
                    // appointmentDate: bill.appointment.appointmentDate,
                    // status: bill.appointment.status,
                    // paymentStatus: bill.appointment.paymentStatus,
                }: null,
            },
        };
    }
    async updateBill(id: number, data: BillDto) {
        const bill = await this.billRepo.findOne({ where: { id } });

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        if (bill.status === 'Paid') {
            throw new BadRequestException('Paid bill cannot be updated');
        }

        if (data.patientName !== undefined) {
            bill.patientName = data.patientName;
        }

        if (data.serviceCharge !== undefined) {
            bill.serviceCharge = data.serviceCharge;
        }

        if (data.billingDate !== undefined) {
            bill.billingDate = data.billingDate;
        }

        const updatedBill = await this.billRepo.save(bill);

        return {
            message: `Bill with id ${id} updated successfully`,
            data: updatedBill,
        };
    }
    


    async deleteBill(id: number) {
        const bill = await this.billRepo.findOne({ where: { id } });

        if (!bill) {
        throw new NotFoundException('Bill not found');
        }

        await this.billRepo.remove(bill);

        return {
        message: `Bill with id ${id} deleted successfully`,
        };
    }
    async updateServiceCharge(id: number, data: ServiceChargeDto) {
        const bill = await this.billRepo.findOne({ where: { id } });

        if (!bill) {
        throw new NotFoundException('Bill not found');
        }

        bill.serviceCharge = data.serviceCharge;
        const updatedBill = await this.billRepo.save(bill);

        return {
        message: `Bill with id ${id} updated successfully`,
        data: updatedBill,
        };
    }

    async payBill(id: number) {
        const bill = await this.billRepo.findOne({
            where: { id },
            relations: ['appointment'],
        });

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        if (bill.status === 'Paid') {
            throw new BadRequestException('Bill is already paid');
        }

        bill.status = 'Paid';
        bill.paymentDate = new Date();

        if (bill.appointment) {
            bill.appointment.paymentStatus = 'Paid';
            await this.appointmentRepo.save(bill.appointment);
        }

        const updatedBill = await this.billRepo.save(bill);

        return {
            message: `Bill with id ${id} marked as paid successfully`,
            data: updatedBill,
        };
    }

    async getBillingReport(startDate?: string, endDate?: string) {
        if ((startDate && !endDate) || (!startDate && endDate)) {
            throw new BadRequestException(
            'Please provide both startDate and endDate together',
            );
        }

        const queryBuilder = this.billRepo
            .createQueryBuilder('bill')
            .leftJoinAndSelect('bill.admin', 'admin')
            .leftJoinAndSelect('bill.appointment', 'appointment')
            .orderBy('bill.id', 'ASC');

        if (startDate && endDate) {
            queryBuilder.where('bill.billingDate BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
            });
        }

        const bills = await queryBuilder.getMany();

        const paidBills = bills.filter((bill) => bill.status === 'Paid');
        const unpaidBills = bills.filter((bill) => bill.status === 'Unpaid');

        const totalBilledAmount = bills.reduce(
            (sum, bill) => sum + Number(bill.serviceCharge),
            0,
        );

        const totalPaidAmount = paidBills.reduce(
            (sum, bill) => sum + Number(bill.serviceCharge),
            0,
        );

        const totalOutstandingAmount = unpaidBills.reduce(
            (sum, bill) => sum + Number(bill.serviceCharge),
            0,
        );

        return {
            message: 'Admin billing report generated successfully',
            generatedFor: 'admin',
            filter: {
            startDate: startDate || null,
            endDate: endDate || null,
            },
            summary: {
            totalBills: bills.length,
            paidBills: paidBills.length,
            unpaidBills: unpaidBills.length,
            totalBilledAmount,
            totalPaidAmount,
            totalOutstandingAmount,
            },
            data: bills,
        };
    }

    // Room & Bed Management
    async getAllRooms() {
        const rooms = await this.roomRepo.find({ order: { id: 'ASC' } });

        return {
            message: 'All rooms retrieved successfully',
            data: rooms,
        };
    }
    async getRoomById(id: number) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return {
            message: `Room with id ${id} retrieved successfully`,
            data: room,
        };
    }

    async createRoom(data: RoomDto) {
        const room = this.roomRepo.create({
            roomType: data.roomType,
            totalBeds: data.totalBeds,
            availableBeds: data.totalBeds,
        });

        const savedRoom = await this.roomRepo.save(room);

        return {
            message: 'Room created successfully',
            data: savedRoom,
        };
    }


    async updateRoom(id: number, data: RoomDto) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        const occupiedBeds = room.totalBeds - room.availableBeds;

        if (data.totalBeds < occupiedBeds) {
            throw new BadRequestException(
                'Total beds cannot be less than the already occupied beds',
            );
        }

        room.roomType = data.roomType;
        room.totalBeds = data.totalBeds;
        room.availableBeds = data.totalBeds - occupiedBeds;

        const updatedRoom = await this.roomRepo.save(room);

        return {
            message: `Room with id ${id} updated successfully`,
            data: [
                { id: updatedRoom.id },
                { uniqueId: updatedRoom.uniqueId }
            ],
        };
    }

    async deleteRoom(id: number) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        await this.roomRepo.remove(room);

        return {
            message: `Room with id ${id} deleted successfully`,
        };
    }

    async assignBed(id: number) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (room.availableBeds <= 0) {
            throw new BadRequestException('No beds available in this room');
        }

        room.availableBeds -= 1;
        const updatedRoom = await this.roomRepo.save(room);

        return {
            message: `Bed assigned successfully in room ${id}`,
            data: updatedRoom,
        };
    }

    async releaseBed(id: number) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (room.availableBeds >= room.totalBeds) {
            throw new BadRequestException(
                'All beds are already available in this room',
            );
        }

        room.availableBeds += 1;
        const updatedRoom = await this.roomRepo.save(room);

        return {
            message: `Bed released successfully in room ${id}`,
            data: updatedRoom,
        };
    }


}