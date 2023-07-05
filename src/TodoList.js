import React from 'react';

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		// Initialize state to store the current task input
		this.state = {
			currentTask: '',
		};

		// Bind 'this' to our methods
		this.updateCurrentTask = this.updateCurrentTask.bind(this);
		this.addTask = this.addTask.bind(this);
	}

	updateCurrentTask(event) {
		// Event handler for input change
		// Update the currentTask state with the new input
		this.setState({ currentTask: event.target.value });
	}

	addTask(event) {
		// Event handler for form submission
		event.preventDefault();
		// For now, just log the current task when the form is submitted
		console.log(this.state.currentTask);
	}

	render() {
		return (
			<div>
				<h1>Welcome to the ToDo List</h1>
				{/* Form for adding new tasks */}
				<form onSubmit={this.addTask}>
					<input
						type="text"
						placeholder="Enter new task"
						value={this.state.currentTask}
						onChange={this.updateCurrentTask}
					/>
					<button type="submit">Add Task</button>
				</form>
			</div>
		);
	}
}
