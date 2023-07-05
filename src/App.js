// Importing React and our new TodoList component
import React from 'react';
import TodoList from './TodoList';

// Defining and exporting our main App component
function App() {
	return (
		<div className="App">
			<TodoList />
		</div>
	);
}

export default App;
