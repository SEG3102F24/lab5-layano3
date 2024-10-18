import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Employee } from "../model/employee";
import { Firestore, collection, addDoc, getDocs, QuerySnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private firestore: Firestore = inject(Firestore);
  private employees$: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  async addEmployee(employee: Employee): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(this.firestore, 'employees'), {
        ...employee,
        dateOfBirth: employee.dateOfBirth.toISOString()
      });
      console.log("Document written with ID: ", docRef.id);
      await this.loadEmployees();
      return true;
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
  }

  async loadEmployees(): Promise<void> {
    try {
      const querySnapshot: QuerySnapshot = await getDocs(collection(this.firestore, 'employees'));
      const employees: Employee[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Employee(
          data['name'],
          new Date(data['dateOfBirth']),
          data['city'],
          data['salary'],
          data['gender'],
          data['email']
        );
      });
      this.employees$.next(employees);
    } catch (e) {
      console.error("Error loading employees: ", e);
    }
  }
}

