import { Student } from '@/types/students';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface StudentState {
    students: Student[];
}

const initialState: StudentState = {
    students: [],
};

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setStudents: (state, action: PayloadAction<Student[]>) => {
            state.students = action.payload;
        },
        addStudent: (state, action: PayloadAction<Student>) => {
            state.students.push(action.payload);
        }
    }
});

export const { setStudents, addStudent } = studentSlice.actions;
export default studentSlice.reducer;
