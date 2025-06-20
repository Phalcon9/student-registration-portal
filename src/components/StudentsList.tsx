import { setStudents } from '@/lib/features/student/studentSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useFetchStudents } from '@/lib/services/studentAPI';
import React, { useEffect, useState } from 'react';
import StudentRegistrationForm from './StudentsRegistrationForm';
import { Student } from '@/types/students';

const StudentListPage = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, isError, error } = useFetchStudents(); // Fetch students using React Query
    const students = useAppSelector((state) => state.students.students); // Get students from Redux

    const [editStudent, setEditStudent] = useState<Student | null>(null); // State to hold the student to be edited
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility

    // When data is fetched, update Redux store
    useEffect(() => {
        if (data) {
            dispatch(setStudents(data));
        }
    }, [data, dispatch]);

    // Fallback in case of API error, use Redux data if available
    if (isError && students.length === 0) {
        return <div>Error fetching data: {error?.message}</div>;
    }

    // Handle Edit Button Click
    const handleEditClick = (student: Student) => {
        setEditStudent(student); // Set the selected student to be edited
        setShowModal(true); // Show the modal
    };

    // Close modal after successful form submission or cancel
    const handleModalClose = () => {
        setShowModal(false); // Close the modal
        setEditStudent(null); // Clear the student state
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center text-primary">List of Students</h2>

            {/* Loading state */}
            {isLoading && <div className="text-center">Loading...</div>}

            {/* Table to display students */}
            {!isLoading && !isError && (students.length > 0 || data) && (
                <table className="table table-striped table-bordered table-hover shadow-sm rounded">
                    <thead className="table-dark">
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Courses</th>
                            <th>Actions</th> {/* Actions Column for Edit */}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((student, index) => (
                            <tr key={index} className="align-middle">
                                <td>{student.fullName}</td>
                                <td>{student.email}</td>
                                <td>{student.age}</td>
                                <td>{student.gender}</td>
                                <td>{student.courses.join(', ')}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm rounded-pill px-3"
                                        onClick={() => handleEditClick(student)} // Trigger the modal
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}


            {/* If no students */}
            {!isLoading && !isError && students.length === 0 && (
                <div className="text-center">No students found!</div>
            )}

            {/* Bootstrap Modal for Edit */}
            {showModal && (
                <div className="modal show" tabIndex={-1} style={{ display: 'block' }} aria-labelledby="editStudentModal" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header ">
                                <h5 className="modal-title">Edit Student</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleModalClose} // Close modal on button click
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Show Edit Form inside the modal */}
                                {editStudent && (
                                    <StudentRegistrationForm
                                        student={editStudent}
                                        onSubmitSuccess={handleModalClose} // Close modal on successful form submission
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentListPage;
