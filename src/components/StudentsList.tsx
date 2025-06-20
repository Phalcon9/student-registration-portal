import { setStudents } from '@/lib/features/student/studentSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useFetchStudents, useDeleteStudent } from '@/lib/services/studentAPI';
import React, { useEffect, useState } from 'react';
import StudentRegistrationForm from './StudentsRegistrationForm';
import { Student } from '@/types/students';
import { useQueryClient } from '@tanstack/react-query';

const StudentListPage = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useFetchStudents(); // Fetch students using React Query
    const students = useAppSelector((state) => state.students.students); // Get students from Redux
    const { mutate: deleteStudentMutation } = useDeleteStudent(); // Mutation hook for deleting a student

    const [editStudent, setEditStudent] = useState<Student | null>(null); // State to hold the student to be edited
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State to control delete confirmation modal visibility
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null); // Store the student to be deleted

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

    // Handle Delete Button Click
    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student); // Set the student to delete
        setShowConfirmDelete(true); // Show the confirmation modal
    };

    // Confirm Delete action
    const confirmDelete = () => {
        if (studentToDelete && data) {
            deleteStudentMutation(studentToDelete.id || "", {
                onSuccess: () => {
                    // Remove the student from the list locally after successful deletion
                    dispatch(setStudents(data.filter(student => student.id !== studentToDelete.id)));
                    setShowConfirmDelete(false); // Close the confirmation modal
                },
                onError: (error) => {
                    console.error("Error deleting student:", error);
                },
                onSettled: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
            });
        }
    };

    // Cancel Delete action
    const cancelDelete = () => {
        setShowConfirmDelete(false); // Close the confirmation modal
        setStudentToDelete(null); // Clear the student state
    };

    // Close modal after successful form submission or cancel
    const handleModalClose = () => {
        setShowModal(false); // Close the modal
        setEditStudent(null); // Clear the student state
    };

    return (
        <div className="container my-5" style={{ height: "80vh" }}>
            <h2 className="mb-4 text-center text-custom-primary">List of Students</h2>

            {/* Loading state */}
            {isLoading && <div className="text-center">Loading...</div>}

            {/* Table to display students */}
            <div className="table-container" style={{ overflowX: 'auto' }}>
                {!isLoading && !isError && (students.length > 0 || data) ? (
                    <table className="table table-striped table-bordered table-hover shadow-sm rounded w-100">
                        <thead className="table-dark">
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Courses</th>
                                <th>Actions</th> 
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
                                        <button
                                            className="btn btn-danger btn-sm rounded-pill px-3 ml-2"
                                            onClick={() => handleDeleteClick(student)} // Trigger the delete confirmation modal
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p> // Optional fallback message
                )}
            </div>


            {/* If no students */}
            {!isLoading && !isError && students.length === 0 && (
                <div className="text-center">No students found!</div>
            )}

            {/* Bootstrap Modal for Edit */}
            {showModal && (
                <div className="modal show" tabIndex={-1} style={{ display: 'block' }} aria-labelledby="editStudentModal" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
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

            {/* Confirmation Modal for Delete */}
            {showConfirmDelete && studentToDelete && (
                <div className="modal show" tabIndex={-1} style={{ display: 'block', marginTop: "200px" }} aria-labelledby="confirmDeleteModal" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cancelDelete} // Close confirmation modal on cancel
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the student <strong>{studentToDelete.fullName} (ID: {studentToDelete.id})</strong> ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentListPage;
