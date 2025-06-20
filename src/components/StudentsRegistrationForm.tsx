import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useAddStudent, useUpdateStudent } from '@/lib/services/studentAPI';
import { addStudent } from '@/lib/features/student/studentSlice';
import { Student, Gender, Course } from '@/types/students';
import { useQueryClient } from '@tanstack/react-query';

// Zod schema
const validationSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .nonempty('Full Name is required'),

    email: z
        .string()
        .email('Invalid email')
        .nonempty('Email is required'),

    age: z
        .number()
        .min(16, 'Age must be between 16 and 40')
        .max(40, 'Age must be between 16 and 40')
        .refine(val => val >= 16 && val <= 40, { message: 'Age must be between 16 and 40' }),

    gender: z
        .enum(['Male', 'Female', 'Other'])
        .refine(val => ['Male', 'Female', 'Other'].includes(val), 'Gender is required'),

    courses: z
        .array(z.enum(['Math', 'Physics', 'CS', 'Literature']))
        .min(1, 'At least one course must be selected'),

    consent: z
        .boolean()
        .refine(val => val === true, 'Consent is required')
});

// Validation function to integrate Zod with Formik
const validateForm = (values: Student) => {
    const result = validationSchema.safeParse(values);
    const errors: Record<string, string> = {};
    if (!result.success) {
        result.error.errors.forEach((err) => {
            errors[err.path[0]] = err.message;
        });
    }
    return errors;
};

const StudentRegistrationForm = ({ student, onSubmitSuccess }: { student?: Student, onSubmitSuccess: () => void }) => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<string>('');
    const dispatch = useDispatch();
    const { mutate: addStudentMutation, isPending } = useAddStudent();
    const { mutate: updateStudentMutation } = useUpdateStudent();
    const queryClient = useQueryClient();

    const handleSubmit = async (values: Student) => {
        if (student) {
            const updatedStudent = { ...values, id: student.id };
            updateStudentMutation(updatedStudent, {
                onSuccess: (data) => {
                    dispatch(addStudent(data));
                    setAlertMessage('Student updated successfully!');
                    setAlertType('success');
                    setTimeout(() => {
                        onSubmitSuccess();
                    }, 1500);
                },
                onError: () => {
                    setAlertMessage('An error occurred. Please try again.');
                    setAlertType('danger');
                },
                onSettled: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
            });
        } else {
            addStudentMutation(values, {
                onSuccess: (data) => {
                    dispatch(addStudent(data));
                    setAlertMessage('Student added successfully!');
                    setAlertType('success');
                    setTimeout(() => {
                        onSubmitSuccess();
                    }, 1500);
                },
                onError: () => {
                    setAlertMessage('An error occurred. Please try again.');
                    setAlertType('danger');
                }
            });
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0a2d3d' }}>{student ? '' : 'Register Student'}</h2>

            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert" style={{ marginBottom: '20px' }}>
                    {alertMessage}
                </div>
            )}

            <Formik
                initialValues={{
                    fullName: student?.fullName || '',
                    email: student?.email || '',
                    age: student?.age || 16,
                    gender: student?.gender || Gender.Male,
                    courses: student?.courses || [],
                    consent: student?.consent || false,
                }}
                validate={validateForm}  // Using the validate function for Zod validation
                onSubmit={handleSubmit}
            >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                    <Form className="bg-white p-4 border rounded shadow-sm" style={{ borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', height: '100%' }}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label" style={{ fontSize: '1.2rem', color: '#0a2d3d' }}>Full Name</label>
                            <Field
                                id="fullName"
                                name="fullName"
                                type="text"
                                className={`form-control ${touched.fullName && errors.fullName ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.fullName}
                                style={{ padding: '10px' }}
                            />
                            <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label" style={{ fontSize: '1.2rem', color: '#0a2d3d' }}>Email</label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                style={{ padding: '10px' }}
                            />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="age" className="form-label" style={{ fontSize: '1.2rem', color: '#0a2d3d' }}>Age</label>
                            <Field
                                id="age"
                                name="age"
                                type="number"
                                className={`form-control ${touched.age && errors.age ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.age}
                                style={{ padding: '10px' }}
                            />
                            <ErrorMessage name="age" component="div" className="invalid-feedback" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label" style={{ fontSize: '1.2rem', color: '#0a2d3d' }}>Gender</label>
                            <Field
                                as="select"
                                id="gender"
                                name="gender"
                                className={`form-select ${touched.gender && errors.gender ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.gender}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Field>
                            <ErrorMessage name="gender" component="div" className="invalid-feedback" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{ fontSize: '1.2rem', color: '#0a2d3d' }}>Courses</label>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    id="Math"
                                    name="courses"
                                    value={Course.Math}
                                    className="form-check-input"
                                    checked={values.courses.includes(Course.Math)}
                                    onChange={handleChange}
                                />
                                <label htmlFor="Math" className="form-check-label">Math</label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    id="Physics"
                                    name="courses"
                                    value={Course.Physics}
                                    className="form-check-input"
                                    checked={values.courses.includes(Course.Physics)}
                                    onChange={handleChange}
                                />
                                <label htmlFor="Physics" className="form-check-label">Physics</label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    id="CS"
                                    name="courses"
                                    value={Course.CS}
                                    className="form-check-input"
                                    checked={values.courses.includes(Course.CS)}
                                    onChange={handleChange}
                                />
                                <label htmlFor="CS" className="form-check-label">Computer Science</label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    id="Literature"
                                    name="courses"
                                    value={Course.Literature}
                                    className="form-check-input"
                                    checked={values.courses.includes(Course.Literature)}
                                    onChange={handleChange}
                                />
                                <label htmlFor="Literature" className="form-check-label">Literature</label>
                            </div>
                            {/* Display error message for courses */}
                            {touched.courses && errors.courses && (
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {errors.courses}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    id="consent"
                                    name="consent"
                                    className="form-check-input"
                                    checked={values.consent}
                                    onChange={handleChange}
                                />
                                <label htmlFor="consent" className="form-check-label">I accept the terms and conditions</label>
                            </div>
                            {/* Display error message for consent */}
                            {touched.consent && errors.consent && (
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {errors.consent}
                                </div>
                            )}
                        </div>


                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={isPending}
                            style={{ padding: '10px', fontSize: '1rem', backgroundColor: '#0a2d3d', borderColor: '#0a2d3d' }}
                        >
                            {isPending ? 'Submitting...' : 'Submit'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default StudentRegistrationForm;
