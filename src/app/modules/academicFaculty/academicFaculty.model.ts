import { Schema, model } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";

const academicFacultySchema = new Schema<TAcademicFaculty>({
    name:{
        type: String,
        required: true
    }
},{
    timestamps: true
})


export const AcademicFaculty = model<TAcademicFaculty>('academicFaculty',academicFacultySchema)