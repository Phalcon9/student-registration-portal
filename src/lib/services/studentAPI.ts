import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Student } from '@/types/students';

const API_URL = 'http://localhost:5000/students'; // Mock API URL

// Fetch all students
export const fetchStudents = async (): Promise<Student[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new student
export const addStudent = async (newStudent: Student): Promise<Student> => {
  const response = await axios.post(API_URL, newStudent);
  return response.data;
};

// Update a student
export const updateStudent = async (updatedStudent: Student): Promise<Student> => {
  const response = await axios.put(`${API_URL}/${updatedStudent.id}`, updatedStudent);
  return response.data;
};

// Delete a student
export const deleteStudent = async (studentId: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/${studentId}`);
  return response.data;
};

// Custom hook to fetch students using React Query
export const useFetchStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });
};

// Custom hook to add a new student using React Query
export const useAddStudent = () => {
  return useMutation({
    mutationFn: addStudent,
  });
};

// Custom hook to update a student using React Query
export const useUpdateStudent = () => {
  return useMutation({
    mutationFn: updateStudent,
  });
};

// Custom hook to delete a student using React Query
export const useDeleteStudent = () => {
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      // Optionally you can trigger a refetch of students after deletion
    },
  });
};
