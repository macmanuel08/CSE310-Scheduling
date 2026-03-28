import { AppointmentAPI } from "./data/utilities";

// This function is a main controller to test the API
async function testAPI() {
  const api = new AppointmentAPI('http://localhost:3000');

  //await api.addAppointment(8, new Date('2026-03-28T09:00:00.000Z'), 2, '08:30 AM');
  //await api.updateStatus(6, 'confirmed');
  await api.deleteAppointment(8);

  const data = await api.getAll();
  //console.log(data.schedules);

  const todayAppointments = api.getAppointmentsToday(data.schedules);
  //console.log(todayAppointments);
}

testAPI();