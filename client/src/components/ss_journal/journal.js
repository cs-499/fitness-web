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

    // Effect hook to load saved meals and notes from localStorage when the component mounts
    useEffect(() => {
        const savedMeals = JSON.parse(localStorage.getItem('savedMeals') || '[]'); // Load meals, fallback to empty array
        const savedNotes = JSON.parse(localStorage.getItem('journalNotes') || '[]'); // Load notes, fallback to empty array
        setMeals(savedMeals); // Set meals state
        setNotes(savedNotes); // Set notes state
    }, []);

    // Function to save a new note to localStorage
    const saveNote = () => {
        if (newNote.trim()) { // Ensure the note is not empty
            const timestamp = new Date().toLocaleString(); // Get the current date and time
            const updatedNotes = [...notes, { text: newNote.trim(), timestamp }]; // Create a new note with timestamp
            setNotes(updatedNotes); // Update the notes state
            setNewNote(''); // Clear the input field
            localStorage.setItem('journalNotes', JSON.stringify(updatedNotes)); // Save updated notes to localStorage
        }
    };

    // Function to delete a specific note by index
    const deleteNote = (index) => {
        const updatedNotes = notes.filter((_, i) => i !== index); // Filter out the note at the specified index
        setNotes(updatedNotes); // Update the notes state
        localStorage.setItem('journalNotes', JSON.stringify(updatedNotes)); // Save updated notes to localStorage
    };

    // Function to delete a specific meal by its ID
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
                                            backgroundColor: '#dc2626', // Red background
                                            color: 'white', // White text
                                            padding: '0.5rem 1rem', // Padding
                                            border: 'none', // No border
                                            borderRadius: '8px', // Rounded corners
                                            cursor: 'pointer', // Pointer cursor
                                            fontSize: '0.9rem', // Font size
                                            fontWeight: 'bold', // Bold font weight
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No meals saved yet. Start saving meals from the recipe page!</p> // Message if no meals are saved
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
                        value={newNote} // Bind the textarea value to state
                        onChange={(e) => setNewNote(e.target.value)} // Update state on input change
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
                        onClick={saveNote} // Save the note on button click
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '1rem auto',
                            backgroundColor: '#1e293b', // Dark blue background
                            color: 'white', // White text
                            padding: '0.75rem 1.5rem', // Padding
                            border: 'none', // No border
                            borderRadius: '8px', // Rounded corners
                            cursor: 'pointer', // Pointer cursor
                            fontSize: '1rem', // Font size
                            fontWeight: 'bold', // Bold font weight
                            width: '120px', // Button width
                            height: '50px', // Button height
                            textAlign: 'center', // Center text
                            lineHeight: '1', // Line height
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
                            transition: 'all 0.2s ease-in-out', // Smooth transition
                        }}
                    >
                        Save
                    </button>

                    {/* Display saved notes */}
                    <div className="saved-notes">
                        {notes.length > 0 ? (
                            notes.map((note, index) => (
                                <div key={index} className="note-item">
                                    <p>{note.text}</p> {/* Display note text */}
                                    <p style={{ fontSize: '0.8rem', color: '#555' }}>
                                        Saved on: {note.timestamp} {/* Display timestamp */}
                                    </p>
                                    <button
                                        onClick={() => deleteNote(index)} // Delete the note on button click
                                        style={{
                                            backgroundColor: '#dc2626', // Red background
                                            color: 'white', // White text
                                            padding: '0.3rem 1rem', // Padding
                                            border: 'none', // No border
                                            borderRadius: '8px', // Rounded corners
                                            cursor: 'pointer', // Pointer cursor
                                            fontSize: '0.8rem', // Font size
                                            fontWeight: 'bold', // Bold font weight
                                            marginTop: '0.5rem', // Top margin
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No notes saved yet. Start writing your thoughts!</p> // Message if no notes are saved
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Recipes; // Export the component for use in other parts of the application
