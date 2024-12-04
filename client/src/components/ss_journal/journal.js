// Import necessary libraries and components
import React, { useState, useEffect } from 'react'; // React library and hooks for state and side effects
import './journal.css'; // CSS file specific to the journal component
import NavBar from "../navbar/nav_bar"; // Navigation bar component

// Main functional component for displaying saved meals and journal notes
const Recipes = () => {
    document.title = 'ShapeShifter'; // Set the document title for the browser tab

    // State variables to manage saved meals, notes, and new note input
    const [meals, setMeals] = useState([]); // State to hold saved meals
    const [notes, setNotes] = useState([]); // State to hold journal notes
    const [newNote, setNewNote] = useState(''); // State to track new note input

    // Fetch meals from local storage (fallback)
    useEffect(() => {
        const savedMeals = JSON.parse(localStorage.getItem('savedMeals') || '[]'); // Load meals, fallback to empty array
        setMeals(savedMeals); // Set meals state
    }, []);

    // Fetch notes from the backend API
    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem('token'); // Retrieve auth token
            if (!token) {
                console.error('User is not authenticated.');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/journal`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass token for authentication
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotes(data); // Update state with notes from backend
                } else {
                    console.error('Failed to fetch notes:', await response.text());
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes(); // Fetch notes on component mount
    }, []);

    // Save a new note to the backend
    const saveNote = async () => {
        if (newNote.trim()) {
            const token = localStorage.getItem('token');
            const timestamp = new Date().toISOString(); // Use ISO format for consistency

            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/journal`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Pass token for authentication
                    },
                    body: JSON.stringify({ text: newNote.trim(), timestamp }), // Send note data to backend
                });

                if (response.ok) {
                    const savedNote = await response.json(); // Get the saved note from the response
                    setNotes((prevNotes) => [...prevNotes, savedNote]); // Append the new note to the state
                    setNewNote(''); // Clear input field
                } else {
                    console.error('Failed to save note:', await response.text());
                }
            } catch (error) {
                console.error('Error saving note:', error);
            }
        }
    };

    // Delete a note from the backend
    const deleteNote = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/journal/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass token for authentication
                },
            });

            if (response.ok) {
                setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id)); // Remove deleted note from state
            } else {
                console.error('Failed to delete note:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    // Delete a specific meal by its ID (local storage)
    const deleteMeal = (id) => {
        const updatedMeals = meals.filter((meal) => meal.id !== id); // Filter out the meal with the specified ID
        setMeals(updatedMeals); // Update the meals state
        localStorage.setItem('savedMeals', JSON.stringify(updatedMeals)); // Save updated meals to localStorage
    };

    // Calculate the total calories from saved meals
    const totalCalories = meals.reduce((sum, meal) => {
        const calories = parseFloat(meal.calories); // Parse the calorie value as a float
        return !isNaN(calories) ? sum + calories : sum; // Add valid calories to the sum
    }, 0);

    // Group meals by the date they were saved
    const groupedMeals = meals.reduce((grouped, meal) => {
        const date = meal.timestamp ? new Date(meal.timestamp).toLocaleDateString() : 'Unknown Date'; // Format the date
        if (!grouped[date]) grouped[date] = []; // Initialize the date group if it doesn't exist
        grouped[date].push(meal); // Add the meal to the appropriate date group
        return grouped;
    }, {});

    return (
        <>
            <NavBar /> {/* Include the navigation bar */}
            <div className="journal-container">
                <h1>Your Saved Meals</h1> {/* Page title */}

                {/* Display grouped meals by date */}
                {Object.keys(groupedMeals).length > 0 ? (
                    Object.entries(groupedMeals).map(([date, mealsForDate]) => (
                        <div key={date} style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#1e293b', textAlign: 'center', marginBottom: '1rem' }}>
                                {date}
                            </h2>
                            {mealsForDate.map((meal) => (
                                <div key={meal.id} className="meal-item">
                                    <div>
                                        <h2>{meal.title}</h2>
                                        <p>Calories: {meal.calories}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMeal(meal.id)} // Delete the meal on button click
                                        style={{
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No meals saved yet. Start saving meals from the recipe page!</p>
                )}

                {/* Display total calories if meals are present */}
                {meals.length > 0 && (
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '2rem',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1e293b',
                        }}
                    >
                        Total Calories: {totalCalories.toFixed(2)} kcal
                    </div>
                )}

                {/* Notes section for writing and saving journal notes */}
                <div className="notes-section">
                    <h2>Journal Notes</h2>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a new note..."
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <button
                        onClick={saveNote}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '1rem auto',
                            backgroundColor: '#1e293b',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            width: '120px',
                            height: '50px',
                            textAlign: 'center',
                            lineHeight: '1',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Save
                    </button>

                    {/* Display saved notes */}
                    <div className="saved-notes">
                        {notes.map((note) => (
                            <div key={note.id} className="note-item">
                                <p>{note.text}</p>
                                <p style={{ fontSize: '0.8rem', color: '#555' }}>
                                    Saved on: {new Date(note.timestamp).toLocaleString()}
                                </p>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        padding: '0.3rem 1rem',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Recipes; // Export the component for use in other parts of the application
