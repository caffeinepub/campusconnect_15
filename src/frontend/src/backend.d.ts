import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Teacher {
    id: string;
    isOnCampus: boolean;
    name: string;
    isAvailable: boolean;
    email: string;
    locationZone?: Type;
}
export interface UserProfile {
    name: string;
    role: Variant_teacher_student;
}
export enum Type {
    lab = "lab",
    library = "library",
    blockA = "blockA",
    blockB = "blockB",
    foodCourt = "foodCourt",
    parking = "parking"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_teacher_student {
    teacher = "teacher",
    student = "student"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllTeachers(): Promise<Array<Teacher>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerStudent(name: string, id: string, email: string): Promise<void>;
    registerTeacher(name: string, id: string, email: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTeachersByName(searchString: string): Promise<Array<Teacher>>;
    setCampusPresence(isOnCampus: boolean): Promise<void>;
    setLocationZone(zone: Type): Promise<void>;
    toggleAvailability(isAvailable: boolean): Promise<void>;
}
