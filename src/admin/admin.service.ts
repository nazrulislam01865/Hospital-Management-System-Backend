import { Body, Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
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

    createDoctor(data: String): object {
        return { message: "Doctor created successfully", data };
    }
    createPatient(data: String): object {
        return { message: "Patient created successfully", data };
    }
    createManager(data: String): object {
        return { message: "Manager created successfully", data };
    }

    updateDoctor(id: number, data: String): object {
        return { message: `Doctor with id ${id} updated successfully`, data };
    }
    updateManager(id: number, data: String): object {
        return { message: `Manager with id ${id} updated successfully`, data };
    }
    updatePatient(id: number, data: String): object {
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

    updatePatients(id: number, data: string): object {
        return { message: `Patient with id ${id} updated successfully`, data };
    }
    updateDoctors(id: number, data: string): object {
        return { message: `Doctor with id ${id} updated successfully`, data };
    }
    updateManagers(id: number, data: string): object {
        return { message: `Manager with id ${id} updated successfully`, data };
    }



}