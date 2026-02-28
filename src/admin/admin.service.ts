import { Body, Injectable } from "@nestjs/common";
import { DoctorDto } from "src/doctor/doctor.dto";
import { PatientDto } from "src/patient/patient.dto";
import { AdminDTO } from "./admin.dto";

interface AdminRecord extends AdminDTO {
  id: number;
}

@Injectable()
export class AdminService {

    private adminIdCounter = 1;
    private readonly admins: AdminRecord[] = [];

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

}