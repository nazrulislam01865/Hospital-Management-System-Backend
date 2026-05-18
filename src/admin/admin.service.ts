import { BadRequestException, Body, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DoctorDto } from "../doctor/doctor.dto";
import { PatientDto, UpdatePatientDto } from "../patient/patient.dto";
import { AdminDTO } from "./admin.dto";
import { AppointmentDto } from "./dto/appointment.dto";
import { BillDto } from "./dto/bill.dto";
import { RoomDto } from "./dto/room.dto";
import { ServiceChargeDto } from "./dto/service-charge.dto";
import { RoomAssignDto } from "./dto/room-assign.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.entity";
import { AdminEntity } from "./entities/admin.entity";
import { BillEntity } from "./entities/bill.entity";
import { RoomEntity } from "./entities/room.entity";
import { PaitentEntity } from "../patient/entities/patient.entity";
import { NotificationService } from "../notification/notification.service";

import * as bcrypt from 'bcryptjs';
import { MailService } from "../mail/mail.service";
import { RoomAssignmentEntity } from "./entities/room-assignment.entity";

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
    @InjectRepository(RoomAssignmentEntity)
    private readonly roomAssignmentRepo: Repository<RoomAssignmentEntity>,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
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

        if (duplicateAdmin && duplicateAdmin.id !== id) {
            throw new BadRequestException(
                'Admin with the same email or username already exists',
            );
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


    // Patient Management


async getAllPatients() {
  const patients = await this.patientRepo.find({
    order: { id: 'ASC' },
  });

  return {
    message: 'All patients retrieved successfully',
    data: patients.map((patient) => ({
      id: patient.id,
      uniqueId: patient.uniqueId,
      name: patient.name,
      email: patient.email,
      dateOfBirth: patient.dateOfBirth,
      socialMediaLinks: patient.socialMediaLinks,
      createdAt: patient.createdAt,
    })),
  };
}


async getPatientById(id: number) {
  const patient = await this.patientRepo.findOne({
    where: { id },
  });

  if (!patient) {
    throw new NotFoundException(`Patient with id ${id} not found`);
  }

  return {
    message: `Patient with id ${id} retrieved successfully`,
    data: {
      id: patient.id,
      uniqueId: patient.uniqueId,
      name: patient.name,
      email: patient.email,
      dateOfBirth: patient.dateOfBirth,
      socialMediaLinks: patient.socialMediaLinks,
      createdAt: patient.createdAt,
    },
  };
}

async createPatient(data: PatientDto): Promise<object> {
  const existingPatient = await this.patientRepo.findOne({
    where: { email: data.email },
  });

  if (existingPatient) {
    throw new ConflictException(
      `Patient with email ${data.email} already exists`,
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const patient = this.patientRepo.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    dateOfBirth: data.dateOfBirth,
    socialMediaLinks: data.socialMediaLinks ?? [],
  });

  try {
    const savedPatient = await this.patientRepo.save(patient);

    //pusher js
    await this.notificationService.sendAdminNotification({
        type: 'PATIENT_CREATED',
        title: 'New patient created',
        message: `${savedPatient.name} has been added as a patient.`,
        href: `/admin/dashboard/patients/${savedPatient.id}`,
        entity: {
            type: 'patient',
            id: savedPatient.id,
        },
    });

    return {
      message: 'Patient created successfully',
      data: {
        id: savedPatient.id,
        uniqueId: savedPatient.uniqueId,
        name: savedPatient.name,
        email: savedPatient.email,
        dateOfBirth: savedPatient.dateOfBirth,
        socialMediaLinks: savedPatient.socialMediaLinks,
        createdAt: savedPatient.createdAt,
      },
    };
  } catch (error) {
    throw new BadRequestException(this.getPatientCreateErrorMessage(error));
  }
}

private getPatientCreateErrorMessage(error: unknown): string {
  const driverError = (error as any)?.driverError || error;
  const message = String(driverError?.detail || driverError?.message || '');
  const lowerMessage = message.toLowerCase();

  if (
    driverError?.code === '23505' ||
    lowerMessage.includes('duplicate') ||
    lowerMessage.includes('unique constraint')
  ) {
    if (lowerMessage.includes('email')) {
      return 'Patient with this email already exists';
    }

    if (
      lowerMessage.includes('uniqueid') ||
      lowerMessage.includes('unique_id')
    ) {
      return 'Patient unique ID already exists. Please try again';
    }

    return 'Patient could not be created because duplicate patient data already exists';
  }

  if (message) {
    return message;
  }

  return 'Patient could not be created because the backend rejected the submitted data';
}

async updatePatients(id: number, data: UpdatePatientDto) {
  const patient = await this.patientRepo.findOne({
    where: { id },
  });

  if (!patient) {
    throw new NotFoundException(`Patient with id ${id} not found`);
  }

  if (data.email && data.email !== patient.email) {
    const existingPatient = await this.patientRepo.findOne({
      where: { email: data.email },
    });

    if (existingPatient && existingPatient.id !== id) {
      throw new ConflictException(
        `Patient with email ${data.email} already exists`,
      );
    }
  }

  if (data.name !== undefined) {
    patient.name = data.name;
  }

  if (data.email !== undefined) {
    patient.email = data.email;
  }

  if (data.password) {
    patient.password = await bcrypt.hash(data.password, 10);
  }

  if (data.dateOfBirth !== undefined) {
    patient.dateOfBirth = data.dateOfBirth;
  }

  if (data.socialMediaLinks !== undefined) {
    patient.socialMediaLinks = data.socialMediaLinks;
  }

  try {
    const updatedPatient = await this.patientRepo.save(patient);

    return {
      message: `Patient with id ${id} updated successfully`,
      data: {
        id: updatedPatient.id,
        uniqueId: updatedPatient.uniqueId,
        name: updatedPatient.name,
        email: updatedPatient.email,
        dateOfBirth: updatedPatient.dateOfBirth,
        socialMediaLinks: updatedPatient.socialMediaLinks,
        createdAt: updatedPatient.createdAt,
      },
    };
  } catch (error) {
    throw new BadRequestException(this.getPatientCreateErrorMessage(error));
  }
}

async deletePatient(id: number) {
  const patient = await this.patientRepo.findOne({
    where: { id },
  });

  if (!patient) {
    throw new NotFoundException(`Patient with id ${id} not found`);
  }

  await this.patientRepo.remove(patient);

  return {
    message: `Patient with id ${id} deleted successfully`,
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
    const appointment = await this.appointmentRepo.findOne({
        where: { id },
        relations: ['patient', 'admin', 'bill'],
    });

    if (!appointment) {
        throw new NotFoundException('Appointment not found');
    }

    return {
        message: `Appointment with id ${id} retrieved successfully`,
        data: {
        id: appointment.id,
        uniqueId: appointment.uniqueId,
        doctorName: appointment.doctorName,
        appointmentDate: appointment.appointmentDate,

        // Important fields:
        status: appointment.status,
        paymentStatus: appointment.paymentStatus,

        createdAt: appointment.createdAt,

        patient: appointment.patient
            ? {
                id: appointment.patient.id,
                uniqueId: appointment.patient.uniqueId,
                name: appointment.patient.name,
                email: appointment.patient.email,
                dateOfBirth: appointment.patient.dateOfBirth,
                socialMediaLinks: appointment.patient.socialMediaLinks,
                createdAt: appointment.patient.createdAt,
            }
            : null,

        admin: appointment.admin
            ? {
                id: appointment.admin.id,
                name: appointment.admin.name,
                uname: appointment.admin.uname,
                email: appointment.admin.email,
            }
            : null,

        bill: appointment.bill
            ? {
                id: appointment.bill.id,
                patientName: appointment.bill.patientName,
                serviceCharge: appointment.bill.serviceCharge,
                roomCharge: appointment.bill.roomCharge ?? 0,
                billingDate: appointment.bill.billingDate,
                status: appointment.bill.status,
                paymentDate: appointment.bill.paymentDate,
            }
            : null,
        },
    };
    }


    // async createAppointment(adminId: number,data: AppointmentDto): Promise<object> {

    //     const admin = await this.adminRepo.findOne({
    //         where: { id: adminId },
    //     });

    //     if (!admin) {
    //         throw new NotFoundException('Admin not found');
    //     }
    //     const patient = await this.patientRepo.findOne({
    //         where: { id: data.patientId },
    //     });

    //     if (!patient) {
    //         throw new NotFoundException(`Patient with id ${data.patientId} not found`);
    //     }

    //     const appointment = this.appointmentRepo.create({
    //         patient,
    //         doctorName: data.doctorName,
    //         appointmentDate: data.appointmentDate
    //         ? new Date(data.appointmentDate)
    //         : new Date(),
    //         status: 'Pending',
    //         paymentStatus: 'Unpaid',
    //         admin,
    //     });

    //     const create= await this.appointmentRepo.save(appointment);
    //     let emailNotification = 'sent';

    //     try {
    //         await this.mailService.sendMail(patient, create);
    //     } catch (error) {
    //         emailNotification = 'failed';
    //         console.error('Appointment email sending failed:', error);
    //     }

    //     return {
    //         message: 'Appointment created successfully',
    //         emailNotification,
    //         data: [
    //             create.id,
    //             create.patient.name,
    //             create.doctorName,
    //             create.appointmentDate,
    //             create.paymentStatus,
    //             create.status,
    //             create.admin.name
    //         ],
    //     }

    // }

    async createAppointment(adminId: number, data: AppointmentDto): Promise<object> {
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

        const create = await this.appointmentRepo.save(appointment);

        await this.notificationService.sendAdminNotification({
            type: 'APPOINTMENT_CREATED',
            title: 'New appointment created',
            message: `${patient.name} has a new appointment with Dr. ${create.doctorName}.`,
            href: `/admin/dashboard/appointments/${create.id}`,
            entity: {
                type: 'appointment',
                id: create.id,
            },
        });

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
                create.admin.name,
            ],
        };
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

        if (fullAppointment) {
            await this.notificationService.sendAdminNotification({
                type: 'APPOINTMENT_UPDATED',
                title: 'Appointment updated',
                message: `${fullAppointment.patient?.name ?? 'A patient'} appointment has been updated.`,
                href: `/admin/dashboard/appointments/${fullAppointment.id}`,
                entity: {
                    type: 'appointment',
                    id: fullAppointment.id,
                },
            });
        }

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
        const appointment = await this.appointmentRepo.findOne({
            where: { id },
            relations: ['patient'],
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        appointment.status = 'Approved';
        const updatedAppointment = await this.appointmentRepo.save(appointment);

        await this.notificationService.sendAdminNotification({
            type: 'APPOINTMENT_APPROVED',
            title: 'Appointment approved',
            message: `${appointment.patient?.name ?? 'A patient'} appointment has been approved.`,
            href: `/admin/dashboard/appointments/${id}`,
            entity: {
                type: 'appointment',
                id,
            },
        });

        return {
            message: `Appointment with id ${id} approved successfully`,
            data: updatedAppointment,
        };
    }


    // async cancelAppointment(id: number) {
    //     const appointment = await this.appointmentRepo.findOne({ where: { id } });

    //     if (!appointment) {
    //         throw new NotFoundException('Appointment not found');
    //     }

    //     appointment.status = 'Cancelled';
    //     const updatedAppointment = await this.appointmentRepo.save(appointment);

    //     return {
    //         message: `Appointment with id ${id} cancelled successfully`,
    //         data: updatedAppointment,
    //     };
    // }

    async cancelAppointment(id: number) {
        const appointment = await this.appointmentRepo.findOne({
            where: { id },
            relations: ['patient'],
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        appointment.status = 'Cancelled';
        const updatedAppointment = await this.appointmentRepo.save(appointment);

        await this.notificationService.sendAdminNotification({
            type: 'APPOINTMENT_CANCELLED',
            title: 'Appointment cancelled',
            message: `${appointment.patient?.name ?? 'A patient'} appointment has been cancelled.`,
            href: `/admin/dashboard/appointments/${id}`,
            entity: {
                type: 'appointment',
                id,
            },
        });

        return {
            message: `Appointment with id ${id} cancelled successfully`,
            data: updatedAppointment,
        };
    }



 





   // Billing Management

    async getAllBills() {
    const bills = await this.billRepo.find({
        relations: ['admin', 'patient', 'appointment', 'appointment.patient'],
        order: { id: 'ASC' },
    });

    return {
        message: 'All bills retrieved successfully',
        data: bills.map((bill) => ({
        id: bill.id,
        patientId: bill.patient?.id ?? bill.appointment?.patient?.id ?? null,
        patientName: bill.patient?.name ?? bill.patientName,
        serviceCharge: bill.serviceCharge,
        roomCharge: bill.roomCharge ?? 0,
        billingDate: bill.billingDate,
        status: bill.status,
        paymentDate: bill.paymentDate,
        createdAt: bill.createdAt,

        patient: bill.patient
            ? {
                id: bill.patient.id,
                uniqueId: bill.patient.uniqueId,
                name: bill.patient.name,
                email: bill.patient.email,
            }
            : bill.appointment?.patient
            ? {
                id: bill.appointment.patient.id,
                uniqueId: bill.appointment.patient.uniqueId,
                name: bill.appointment.patient.name,
                email: bill.appointment.patient.email,
                }
            : null,

        admin: bill.admin
            ? {
                name: bill.admin.name,
                email: bill.admin.email,
            }
            : null,

        appointment: bill.appointment
            ? {
                id: bill.appointment.id,
                patient: bill.appointment.patient
                ? {
                    id: bill.appointment.patient.id,
                    name: bill.appointment.patient.name,
                    email: bill.appointment.patient.email,
                    socialMediaLinks:
                        bill.appointment.patient.socialMediaLinks,
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
    const admin = await this.adminRepo.findOne({
        where: { id: adminId },
    });

    if (!admin) {
        throw new NotFoundException('Admin not found');
    }

    let appointment: Appointment | null = null;
    let patient: PaitentEntity | null = null;

    if (data.patientId) {
        patient = await this.patientRepo.findOne({
        where: { id: data.patientId },
        });

        if (!patient) {
        throw new NotFoundException(`Patient with id ${data.patientId} not found`);
        }
    }

    if (data.appointmentId) {
        appointment = await this.appointmentRepo.findOne({
        where: { id: data.appointmentId },
        relations: ['bill', 'patient'],
        });

        if (!appointment) {
        throw new NotFoundException('Appointment not found');
        }

        if (appointment.bill) {
        throw new BadRequestException('This appointment already has a bill');
        }

        if (patient && appointment.patient?.id !== patient.id) {
        throw new BadRequestException(
            'Patient ID does not match the appointment patient',
        );
        }

        if (!patient && data.patientName !== appointment.patient?.name) {
        throw new BadRequestException(
            'Patient name does not match the appointment patient',
        );
        }

        if (!patient && appointment.patient) {
        patient = appointment.patient;
        }
    }

    const billPatientName = patient?.name ?? data.patientName;

    if (!billPatientName) {
        throw new BadRequestException('Patient name is required');
    }

    const bill = this.billRepo.create({
        patientName: billPatientName,
        patient: patient || undefined,
        serviceCharge: data.serviceCharge,
        roomCharge: data.roomCharge ?? 0,
        billingDate: data.billingDate,
        status: 'Unpaid',
        admin,
        appointment: appointment || undefined,
    });

    const savedBill = await this.billRepo.save(bill);

    const fullBill = await this.billRepo.findOne({
        where: { id: savedBill.id },
        relations: ['admin', 'patient', 'appointment', 'appointment.patient'],
    });

    if (fullBill) {
        await this.notificationService.sendAdminNotification({
            type: 'BILL_CREATED',
            title: 'New bill created',
            message: `A new bill has been created for ${fullBill.patientName}.`,
            href: `/admin/dashboard/billing`,
            entity: {
                type: 'bill',
                id: fullBill.id,
            },
        });
    }

    return {
        message: 'Bill created successfully',
        data: fullBill,
    };
    }

    async getBillById(id: number) {
    const bill = await this.billRepo.findOne({
        where: { id },
        relations: ['admin', 'patient', 'appointment', 'appointment.patient'],
    });

    if (!bill) {
        throw new NotFoundException('Bill not found');
    }

    return {
        message: `Bill with id ${id} retrieved successfully`,
        data: {
        id: bill.id,
        uniqueId: bill.uniqueId,
        patientId: bill.patient?.id ?? bill.appointment?.patient?.id ?? null,
        patientName: bill.patient?.name ?? bill.patientName,
        serviceCharge: bill.serviceCharge,
        roomCharge: bill.roomCharge ?? 0,
        billingDate: bill.billingDate,
        status: bill.status,
        paymentDate: bill.paymentDate,
        createdAt: bill.createdAt,

        patient: bill.patient
            ? {
                id: bill.patient.id,
                uniqueId: bill.patient.uniqueId,
                name: bill.patient.name,
                email: bill.patient.email,
            }
            : bill.appointment?.patient
            ? {
                id: bill.appointment.patient.id,
                uniqueId: bill.appointment.patient.uniqueId,
                name: bill.appointment.patient.name,
                email: bill.appointment.patient.email,
                }
            : null,

        admin: bill.admin
            ? {
                id: bill.admin.id,
            }
            : null,

        appointment: bill.appointment
            ? {
                id: bill.appointment.id,
            }
            : null,
        },
    };
    }

    async updateBill(id: number, data: BillDto) {
    const bill = await this.billRepo.findOne({
        where: { id },
        relations: ['patient'],
    });

    if (!bill) {
        throw new NotFoundException('Bill not found');
    }

    if (bill.status === 'Paid') {
        throw new BadRequestException('Paid bill cannot be updated');
    }

    if (data.patientId !== undefined) {
        const patient = await this.patientRepo.findOne({
        where: { id: data.patientId },
        });

        if (!patient) {
        throw new NotFoundException(`Patient with id ${data.patientId} not found`);
        }

        bill.patient = patient;
        bill.patientName = patient.name;
    } else if (data.patientName !== undefined) {
        bill.patientName = data.patientName;
    }

    if (data.serviceCharge !== undefined) {
        bill.serviceCharge = data.serviceCharge;
    }

    if (data.roomCharge !== undefined) {
        bill.roomCharge = data.roomCharge;
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
    const bill = await this.billRepo.findOne({
        where: { id },
    });

    if (!bill) {
        throw new NotFoundException('Bill not found');
    }

    await this.billRepo.remove(bill);

    return {
        message: `Bill with id ${id} deleted successfully`,
    };
    }

    async updateServiceCharge(id: number, data: ServiceChargeDto) {
    const bill = await this.billRepo.findOne({
        where: { id },
    });

    if (!bill) {
        throw new NotFoundException('Bill not found');
    }

    if (bill.status === 'Paid') {
        throw new BadRequestException('Paid bill cannot be updated');
    }

    bill.serviceCharge = data.serviceCharge;

    if (data.roomCharge !== undefined) {
        bill.roomCharge = data.roomCharge;
    }

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
    //pusher js
    await this.notificationService.sendAdminNotification({
        type: 'BILL_PAID',
        title: 'Bill paid',
        message: `Bill #${updatedBill.id} has been marked as paid.`,
        href: `/admin/dashboard/billing`,
        entity: {
            type: 'bill',
            id: updatedBill.id,
        },
    });

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
        const rooms = await this.roomRepo.find({
            relations: ['assignments', 'assignments.patient', 'assignments.assignedBy'],
            order: { id: 'ASC' },
        });

        return {
            message: 'All rooms retrieved successfully',
            data: rooms.map((room) => this.formatRoomResponse(room)),
        };
    }
    async getRoomById(id: number) {
        const room = await this.roomRepo.findOne({
            where: { id },
            relations: ['assignments', 'assignments.patient', 'assignments.assignedBy'],
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return {
            message: `Room with id ${id} retrieved successfully`,
            data: this.formatRoomResponse(room),
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

    async assignBed(id: number, adminId: number, data: RoomAssignDto) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (room.availableBeds <= 0) {
            throw new BadRequestException('No beds available in this room');
        }

        const patient = await this.patientRepo.findOne({
            where: { id: data.patientId },
        });

        if (!patient) {
            throw new NotFoundException(`Patient with id ${data.patientId} not found`);
        }

        const admin = await this.adminRepo.findOne({ where: { id: adminId } });

        if (!admin) {
            throw new NotFoundException('Assigning admin not found');
        }

        const activePatientAssignment = await this.roomAssignmentRepo.findOne({
            where: {
                patient: { id: data.patientId },
                status: 'Assigned',
            },
            relations: ['room', 'patient'],
        });

        if (activePatientAssignment) {
            throw new BadRequestException(
                `Patient with id ${data.patientId} is already assigned to room ${activePatientAssignment.room.id}`,
            );
        }

        room.availableBeds -= 1;
        await this.roomRepo.save(room);
        //pusher js
        await this.notificationService.sendAdminNotification({
            type: 'ROOM_ASSIGNED',
            title: 'Room assigned',
            message: `${patient.name} has been assigned to room ${room.id}.`,
            href: `/admin/dashboard/rooms`,
            entity: {
                type: 'room',
                id: room.id,
            },
        });

        const assignment = this.roomAssignmentRepo.create({
            room,
            patient,
            assignedBy: admin,
            status: 'Assigned',
        });

        await this.roomAssignmentRepo.save(assignment);

        const updatedRoom = await this.roomRepo.findOne({
            where: { id },
            relations: ['assignments', 'assignments.patient', 'assignments.assignedBy'],
        });

        return {
            message: `Room ${id} assigned successfully to patient ${data.patientId}`,
            data: updatedRoom ? this.formatRoomResponse(updatedRoom) : null,
        };
    }

    async releaseBed(id: number, patientId?: number) {
        const room = await this.roomRepo.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (room.availableBeds >= room.totalBeds) {
            throw new BadRequestException(
                'All beds are already available in this room',
            );
        }

        const assignmentQuery = this.roomAssignmentRepo
            .createQueryBuilder('assignment')
            .leftJoinAndSelect('assignment.room', 'room')
            .leftJoinAndSelect('assignment.patient', 'patient')
            .leftJoinAndSelect('assignment.assignedBy', 'assignedBy')
            .where('room.id = :id', { id })
            .andWhere('assignment.status = :status', { status: 'Assigned' })
            .orderBy('assignment.id', 'DESC');

        if (patientId) {
            assignmentQuery.andWhere('patient.id = :patientId', { patientId });
        }

        const activeAssignment = await assignmentQuery.getOne();

        if (!activeAssignment) {
            throw new NotFoundException(
                patientId
                    ? `No active assignment found for patient ${patientId} in room ${id}`
                    : `No active assignment found in room ${id}`,
            );
        }

        activeAssignment.status = 'Released';
        activeAssignment.releasedAt = new Date();
        await this.roomAssignmentRepo.save(activeAssignment);

        room.availableBeds += 1;
        await this.roomRepo.save(room);
        //pusher js
        await this.notificationService.sendAdminNotification({
            type: 'ROOM_RELEASED',
            title: 'Bed released',
            message: `A bed has been released from room ${room.id}.`,
            href: `/admin/dashboard/rooms`,
            entity: {
                type: 'room',
                id: room.id,
            },
        });

        const updatedRoom = await this.roomRepo.findOne({
            where: { id },
            relations: ['assignments', 'assignments.patient', 'assignments.assignedBy'],
        });

        return {
            message: `Bed released successfully in room ${id}`,
            data: updatedRoom ? this.formatRoomResponse(updatedRoom) : null,
        };
    }

    private formatRoomResponse(room: RoomEntity) {
        return {
            id: room.id,
            uniqueId: room.uniqueId,
            roomType: room.roomType,
            totalBeds: room.totalBeds,
            availableBeds: room.availableBeds,
            createdAt: room.createdAt,
            assignments: (room.assignments || []).map((assignment) => ({
                id: assignment.id,
                uniqueId: assignment.uniqueId,
                status: assignment.status,
                assignedAt: assignment.assignedAt,
                releasedAt: assignment.releasedAt,
                patient: assignment.patient
                    ? {
                        id: assignment.patient.id,
                        uniqueId: assignment.patient.uniqueId,
                        name: assignment.patient.name,
                        email: assignment.patient.email,
                    }
                    : null,
                assignedBy: assignment.assignedBy
                    ? {
                        id: assignment.assignedBy.id,
                        uniqueId: assignment.assignedBy.uniqueId,
                        name: assignment.assignedBy.name,
                        email: assignment.assignedBy.email,
                    }
                    : null,
            })),
        };
    }


}


