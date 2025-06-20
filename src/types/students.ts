export enum Course {
    Math = 'Math',
    Physics = 'Physics',
    CS = 'CS',
    Literature = 'Literature',
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}


export interface Student {
    id?: string;
    fullName: string;
    email: string;
    age: number;
    gender: Gender;
    courses: Course[]; // Now using enum for courses
    consent: boolean;
}
