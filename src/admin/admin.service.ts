import { Body, Injectable } from "@nestjs/common";
import { DoctorDto } from "src/doctor/doctor.dto";
import { PatientDto } from "src/patient/patient.dto";
import { AdminDTO } from "./admin.dto";
import { AppointmentDto } from "./dto/appointment.dto";
import { BillDto } from "./dto/bill.dto";
import { RoomDto } from "./dto/room.dto";
import { ServiceChargeDto } from "./dto/service-charge.dto";

interface AdminRecord extends AdminDTO {
  id: number;
}

interface AppointmentRecord extends AppointmentDto {
  id: number;
  status: 'Pending' | 'Approved' | 'Cancelled';
}

interface BillRecord extends BillDto {
  id: number;
  paymentStatus: 'Paid' | 'Unpaid';
}

interface RoomRecord {
  id: number;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
}
@Injectable()
export class AdminService {

    private adminIdCounter = 1;
    private readonly admins: AdminRecord[] = [];
    private appointmentIdCounter = 1;
    private billIdCounter = 1;
    private roomIdCounter = 1;

    private readonly appointments: AppointmentRecord[] = [];
    private readonly bills: BillRecord[] = [];
    private readonly rooms: RoomRecord[] = [];

    getAllUsers(): object {
        return { message: "All users retrieved successfully" };
    }
    getAllDoctors(): object {
        return { message: "All doctors retrieved successfully" };
    }
    getAllPatients(): object {
        return { message: "All patients retrieved successfully" };
    }
    getAllManagers(): object {
        return { message: "All managers retrieved successfully" };
    }


    // createAdmin(data: AdminDTO): object {
    //     return { message: "Admin created successfully", data };
    // }
    createDoctor(data: DoctorDto): object {
        return { message: "Doctor created successfully", data };
    }
    createPatient(data: PatientDto): object {
        return { message: "Patient created successfully", data };
    }
    createManager(data: String): object {
        return { message: "Manager created successfully", data };
    }

    updateDoctor(id: number, data: DoctorDto): object {
        return { message: `Doctor with id ${id} updated successfully`, data };
    }
    updateManager(id: number, data: String): object {
        return { message: `Manager with id ${id} updated successfully`, data };
    }
    updatePatient(id: number, data: PatientDto): object {
        return { message: `Patient with id ${id} updated successfully`, data };
    }

    deletePatient(id: number) {
        return { message: `Patient with id ${id} deleted successfully` };
    }
    deleteDoctor(id: number) {
        return { message: `Doctor with id ${id} deleted successfully` };
    }
    deleteManager(id: number) {
        return { message: `Manager with id ${id} deleted successfully` };
    }

    updatePatients(id: number, data: PatientDto): object {
        return { message: `Patient with id ${id} updated successfully`, data };
    }
    updateDoctors(id: number, data: DoctorDto): object {
        return { message: `Doctor with id ${id} updated successfully`, data };
    }
    updateManagers(id: number, data: string): object {
        return { message: `Manager with id ${id} updated successfully`, data };
    }

    // Admin CRUD operations
    getAllAdmins(): object {
        return {
        message: 'All admins retrieved successfully',
        data: this.admins,
        };
    }

    getAdminById(id: number): object {
        const admin = this.admins.find((item) => item.id === id);
        return {message: `Admin with id ${id} retrieved successfully`,data: admin,
        };
    }

    createAdmin(data: AdminDTO): object {
        const newAdmin: AdminRecord = {
        id: this.adminIdCounter++,
        ...data,
        };

        this.admins.push(newAdmin);

        return {
        message: 'Admin created successfully',
        data: newAdmin,
        };
    }

    updateAdmin(id: number, data: AdminDTO): object {
        const index = this.admins.findIndex((item) => item.id === id);
        const updatedAdmin: AdminRecord = {id,...data};
        this.admins[index] = updatedAdmin;
        return {message: `Admin with id ${id} updated successfully`,data: updatedAdmin,
        };
    }

    deleteAdmin(id: number): object {
        const index = this.admins.findIndex((item) => item.id === id);
        this.admins.splice(index, 1);
        return {message: `Admin with id ${id} deleted successfully`};
    }

    //appointment, bill, and room management
    // Appointment Management
    getAllAppointments(): object {
        return {
        message: 'All appointments retrieved successfully',
        data: this.appointments,
        };
    }

    createAppointment(data: AppointmentDto): object {
        const newAppointment: AppointmentRecord = {
        id: this.appointmentIdCounter++,
        ...data,
        status: 'Pending',
        };

        this.appointments.push(newAppointment);

        return {
        message: 'Appointment created successfully',
        data: newAppointment,
        };
    }

    approveAppointment(id: number): object {
        const appointment = this.appointments.find((item) => item.id === id);

        if (!appointment) {
            return { message: 'Appointment not found'};
        }
        appointment.status = 'Approved';
        return {message: `Appointment with id ${id} approved successfully`,data: appointment};
    }

    cancelAppointment(id: number): object {
        const appointment = this.appointments.find((item) => item.id === id);

        if (!appointment) {
            return {
                message: 'Appointment not found',
            };
        }

        appointment.status = 'Cancelled';

        return {
        message: `Appointment with id ${id} cancelled successfully`,
        data: appointment,
        };
    }

    // Billing Management
    getAllBills(): object {
        return {
        message: 'All bills retrieved successfully',
        data: this.bills,
        };
    }

    createBill(data: BillDto): object {
        const newBill: BillRecord = {
        id: this.billIdCounter++,
        ...data,
        paymentStatus: 'Unpaid',
        };

        this.bills.push(newBill);

        return {
        message: 'Bill created successfully',
        data: newBill,
        };
    }

    updateServiceCharge(id: number, data: ServiceChargeDto): object {
        const bill = this.bills.find((item) => item.id === id);

        if (!bill) {
            return {
                message: 'Bill not found',
            };
        }

        bill.serviceCharge = data.serviceCharge;

        return {
        message: `Bill with id ${id} updated successfully`,
        data: bill,
        };
    }

    payBill(id: number): object {
        const bill = this.bills.find((item) => item.id === id);

        if (!bill) {
            return {
                message: 'Bill not found',
            };
        }

        bill.paymentStatus = 'Paid';

        return {
        message: `Bill with id ${id} marked as paid successfully`,
        data: bill,
        };
    }

    // Room & Bed Management
    getAllRooms(): object {
        return {
        message: 'All rooms retrieved successfully',
        data: this.rooms,
        };
    }

    createRoom(data: RoomDto): object {
        const newRoom: RoomRecord = {
        id: this.roomIdCounter++,
        roomType: data.roomType,
        totalBeds: data.totalBeds,
        availableBeds: data.totalBeds,
        };

        this.rooms.push(newRoom);

        return {
        message: 'Room created successfully',
        data: newRoom,
        };
    }

    assignBed(id: number): object {
        const room = this.rooms.find((item) => item.id === id);

        if (!room) {
            return {
                message: 'Room not found',
            };
        }

        if (room.availableBeds <= 0) {
        return {
            message: 'No beds available in this room',
        };
        }

        room.availableBeds -= 1;

        return {
        message: `Bed assigned successfully in room ${id}`,
        data: room,
        };
    }

    releaseBed(id: number): object {
        const room = this.rooms.find((item) => item.id === id);

        if (!room) {
            return {
                message: 'Room not found',
            };
        }

        if (room.availableBeds >= room.totalBeds) {
        return {
            message: 'All beds are already available in this room',
        };
        }

        room.availableBeds += 1;

        return {
        message: `Bed released successfully in room ${id}`,
        data: room,
        };
    }

}