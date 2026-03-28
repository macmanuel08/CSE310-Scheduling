import { PersonType, ScheduleType } from './types';

export class Person implements PersonType {
    id: number;
    name: string;
    age: number;
    phone: string;

    constructor(id: number, name: string, age: number, phone: string) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.phone = phone;
    }
}

export class Schedule implements ScheduleType {
    id: number;
    date: Date;
    personId: number;
    time: string;
    status: string;

    constructor (id: number, date: Date, personId: number, time: string, status: string) {
        this.id = id;
        this.date = date;
        this.personId = personId;
        this.time = time;
        this.status = status;
    }

    updateStatus(status: string) {
        if (status == "pending" || status == "confirmed" || status == "canceled" || status == "completed" ) {
            this.status = status;
        } else {
            console.log("Invalid status. Try again!");
        }
    }
}

export class AppointmentAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAll() {
    try {
      const res = await fetch(this.baseUrl);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error';

      console.error('Error:', message);
      throw err;
    }
  }

  getAppointmentsToday(
    appointments: ScheduleType[],
    index = 0,
    result: ScheduleType[] = []
  ): ScheduleType[] {
    if (index >= appointments.length) return result;

    const today = new Date().toLocaleDateString('en-CA');
    const appointmentDate = appointments[index]!.date;
    const appointmentDateString = new Date(appointmentDate)
      .toISOString()
      .split('T')[0];

    if (appointmentDateString === today) {
      result.push(appointments[index]!);
    }

    return this.getAppointmentsToday(appointments, index + 1, result);
  }

  async addAppointment(
    id: number,
    date: Date,
    personId: number,
    time: string
  ) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, date, personId, time }),
    });

    const data = await response.json();
    console.log(data.message);
    return data;
  }

  async updateStatus(id: number, status: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    console.log(data.message);
    return data;
  }

  async deleteAppointment(id: number) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log(data.message);
    console.log(data.schedules);
    return data;
  }
}