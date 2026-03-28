export interface PersonType {
    id: number;
    name: string;
    age: number;
    phone: string;
}

export interface ScheduleType {
    id: number;
    date: Date;
    personId: number;
    time: string;
    status: string;
}