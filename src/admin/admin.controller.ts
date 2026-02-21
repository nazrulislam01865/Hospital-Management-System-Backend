import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { get } from "http";
import { AdminDTO } from "./admin.dto";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    // Get all users, doctors, patients, and managers
    @Get('get-all-users')
    getAllUsers(@Body() data: AdminDTO): object   {
        return this.adminService.getAllUsers();
    }
    @Get('doctors')
    getAllDoctors() {
        return this.adminService.getAllDoctors();
    }
    @Get('patients')
    getAllPatients() {
        return this.adminService.getAllPatients();
    }
    @Get('managers')
    getAllManagers() {
        return this.adminService.getAllManagers();
    }

    // Create new doctor, patient, and manager
    @Post('doctors')
    createDoctor(@Body() data: String): object {
        return this.adminService.createDoctor(data);
    }
    @Post('patients')
    createPatient(@Body() data: String): object {
        return this.adminService.createPatient(data);
    }
    @Post('managers')
    createManager(@Body() data: String): object {
        return this.adminService.createManager(data);
    }


    // Update doctor, patient, and manager by id
    @Put('update-doctor/:id')
    updateDoctor(@Param('id') id: number, @Body() data: String): object {
        return this.adminService.updateDoctor(id, data);
    }
    @Put('update-manager/:id')
    updateManager(@Param('id') id: number, @Body() data: String): object {
        return this.adminService.updateManager(id, data);
    }
    @Put('update-patient/:id')
    updatePatient(@Param('id') id: number, @Body() data: String): object {
        return this.adminService.updatePatient(id, data);
    }

    // Delete doctor, patient, and manager by id
    @Delete('patients/:id')
    deletePatient(@Param('id') id: number) {
        return this.adminService.deletePatient(id);
    }
    @Delete('doctors/:id')
    deleteDoctor(@Param('id') id: number) {
        return this.adminService.deleteDoctor(id);
    }
    @Delete('managers/:id')
    deleteManager(@Param('id') id: number) {
        return this.adminService.deleteManager(id);
    }

    // Update doctor, patient, and manager by id
    @Patch('patients/:id')
    updatePatients(@Param('id') id: number, @Body() data: string):object {
        return this.adminService.updatePatients(id, data);
    }
    @Patch('doctors/:id')
    updateDoctors(@Param('id') id: number, @Body() data: string):object {
        return this.adminService.updateDoctors(id, data);
    }
    @Patch('managers/:id')
    updateManagers(@Param('id') id: number, @Body() data: string):object {
        return this.adminService.updateManagers(id, data);
    }


}