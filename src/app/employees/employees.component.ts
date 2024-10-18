import { Component, OnInit, inject } from '@angular/core';
import { EmployeeService } from "../service/employee.service";
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { Employee } from "../model/employee";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, AsyncPipe, DatePipe, CommonModule]
})
export class EmployeesComponent implements OnInit {
  protected employeeService: EmployeeService = inject(EmployeeService);
  employees$: Observable<readonly Employee[]>;

  constructor() {
    this.employees$ = this.employeeService.$;
  }

  ngOnInit() {
    this.loadEmployees();
  }

  async loadEmployees() {
    await this.employeeService.loadEmployees();
  }

  goBack() {
    window.history.back();
  }
}
