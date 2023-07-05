// Importing React into our component
import React from 'react';

// Defining and exporting our TodoList component
export default class TodoList extends React.Component {
	// The render function describes what the UI will look like for the component
	render() {
		return (
			// For now, our component will just display a simple message
			<div>
				<h1>Welcome to the ToDo List</h1>
			</div>
		);
	}
}
