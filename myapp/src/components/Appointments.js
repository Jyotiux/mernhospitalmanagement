// Appointments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from './AppointmentCard';
import './Appointment.css';

const Appointments = () => {
    // Holds the list of all fetched appointments from the backend
    const [appointments, setAppointments] = useState([]);
    // Stores the input values for creating a new appointment
    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        doctorName: '',
        date: ''
    });
    // Stores the appointment currently being edited (used in edit mode)
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    // Boolean flag to toggle between 'Add' and 'Edit' modes in the form
    const [isEditMode, setIsEditMode] = useState(false);

// useEffect hook to fetch all appointments when the component first mounts
useEffect(() => {
    // Send GET request to the backend API to fetch appointments
    axios
        .get('http://localhost:5000/appointments')
        .then((response) => 
            // Set the fetched data into the state variable
            setAppointments(response.data)
        )
        .catch((error) => 
            // Log any error that occurs during the fetch
            console.error('Error fetching appointments:', error)
        );
}, []); // Empty dependency array ensures this runs only once after the initial render


// Function to handle adding a new appointment
const handleAddAppointment = (e) => {
    e.preventDefault(); // Prevent form from submitting and refreshing the page

    // Send POST request to the backend to add the new appointment
    axios
        .post('http://localhost:5000/appointments/add', newAppointment)
        .then((response) => {
            console.log(response.data); // Log the newly added appointment (optional for debugging)

            // Update the appointments state by adding the new appointment to the list
            setAppointments([...appointments, response.data]);

            // Clear the form inputs after successful submission
            setNewAppointment({ patientName: '', doctorName: '', date: '' });
        })
        .catch((error) =>
            // Log any error that occurs during the POST request
            console.error('Error adding appointment:', error)
        );
};


// Function to handle updating an existing appointment
const handleUpdateAppointment = (id, e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Send POST request to update the appointment with the given ID
    axios
        .post(`http://localhost:5000/appointments/update/${id}`, selectedAppointment)
        .then((response) => {
            console.log(response.data); // Optional: log the updated data for debugging

            // Create a copy of the updated appointment with the correct ID
            const updatedApp = { ...selectedAppointment, _id: id };

            // Update the appointments list by replacing the old appointment with the updated one
            setAppointments(
                appointments.map((appointment) =>
                    appointment._id === id ? updatedApp : appointment
                )
            );

            // Clear the selected appointment and exit edit mode
            setSelectedAppointment(null);
            setIsEditMode(false);
        })
        .catch((error) =>
            // Log any errors that occur during the update
            console.error('Error updating appointment:', error)
        );
};


// Function to handle deleting an appointment by ID
const handleDeleteAppointment = (id) => {
    // Send a DELETE request to the backend API with the appointment's ID
    axios
        .delete(`http://localhost:5000/appointments/delete/${id}`)
        .then((response) => {
            console.log(response.data); // Optional: Log success message from the backend

            // Update the local appointments state by filtering out the deleted appointment
            setAppointments(
                appointments.filter((appointment) => appointment._id !== id)
            );
        })
        .catch((error) =>
            // Log any errors that occur during the deletion
            console.error('Error deleting appointment:', error)
        );
};


// Function to enter "Edit Mode" for a selected appointment
const handleEditAppointment = (appointment) => {
    // Set the selected appointment to be edited
    setSelectedAppointment(appointment);

    // Enable edit mode so the form displays current values for editing
    setIsEditMode(true);
};


  return (
    // Main container - flex row layout
    <div className='flex-row' style={{ width: '100%' }}>
        
        {/* Left section - form for adding or editing appointments */}
        <div className='flex-column'>
            <div className='add-form'>
                <h4>
                    {/* Heading changes based on mode */}
                    {isEditMode ? 'Edit Appointment' : 'Add New Appointment'}
                </h4>

                {/* Form submission handled differently based on mode */}
                <form
                    className="appointment-form"
                    onSubmit={
                        isEditMode
                            ? (e) => handleUpdateAppointment(selectedAppointment._id, e)
                            : handleAddAppointment
                    }
                >
                    {/* Patient Name input */}
                    <label>Patient Name:</label>
                    <input
                        type="text"
                        value={
                            isEditMode
                                ? selectedAppointment.patientName
                                : newAppointment.patientName
                        }
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedAppointment({
                                      ...selectedAppointment,
                                      patientName: e.target.value
                                  })
                                : setNewAppointment({
                                      ...newAppointment,
                                      patientName: e.target.value
                                  })
                        }
                    />

                    {/* Doctor Name input */}
                    <label>Doctor Name:</label>
                    <input
                        type="text"
                        value={
                            isEditMode
                                ? selectedAppointment.doctorName
                                : newAppointment.doctorName
                        }
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedAppointment({
                                      ...selectedAppointment,
                                      doctorName: e.target.value
                                  })
                                : setNewAppointment({
                                      ...newAppointment,
                                      doctorName: e.target.value
                                  })
                        }
                    />

                    {/* Appointment Date input */}
                    <label>Date:</label>
                    <input
                        type="date"
                        value={
                            isEditMode
                                ? selectedAppointment.date
                                : newAppointment.date
                        }
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedAppointment({
                                      ...selectedAppointment,
                                      date: e.target.value
                                  })
                                : setNewAppointment({
                                      ...newAppointment,
                                      date: e.target.value
                                  })
                        }
                    />

                    {/* Submit button changes label based on mode */}
                    <button type="submit">
                        {isEditMode ? 'Update Appointment' : 'Add Appointment'}
                    </button>
                </form>
            </div>
        </div>

        {/* Right section - list of appointments */}
        <div className='appointments'>
            <h3>Appointments ({appointments.length})</h3>

            <div className="appointment-list">
                {appointments.map((appointment) => (
                    <AppointmentCard
                        key={appointment._id} // Unique key for each appointment
                        appointment={appointment} // Appointment data passed as prop
                        onEdit={handleEditAppointment} // Edit handler
                        onDelete={handleDeleteAppointment} // Delete handler
                    />
                ))}
            </div>
        </div>
    </div>
);
}
export default Appointments;