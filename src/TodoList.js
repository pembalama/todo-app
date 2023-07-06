import React from 'react';

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		// Initialize state with currentTask as an empty string and tasks as an empty array
		this.state = {
			currentTask: '',
			tasks: [],
		};

		// Bind 'this' to our methods
		this.updateCurrentTask = this.updateCurrentTask.bind(this);
		this.addTask = this.addTask.bind(this);
		this.toggleTask = this.toggleTask.bind(this);
	}

	updateCurrentTask(event) {
		// Update the currentTask state with the new input
		this.setState({ currentTask: event.target.value });
	}

	addTask(event) {
		// Prevent form from refreshing the page
		event.preventDefault();

		// Add the current task to the tasks array and clear currentTask
		if (this.state.currentTask !== '') {
			this.setState(prevState => ({
				tasks: [
					...prevState.tasks,
					{ text: this.state.currentTask, completed: false },
				],
				currentTask: '',
			}));
		}
	}

	toggleTask(index) {
		console.log('Before toggle: ', JSON.stringify(this.state.tasks[index]));

		this.setState(
			prevState => {
				const tasks = prevState.tasks.map((task, taskIndex) => {
					if (taskIndex === index) {
						// This is the task we clicked, so toggle its completed status
						return { ...task, completed: !task.completed };
					} else {
						// This is not the task we clicked, so leave it as is
						return task;
					}
				});

				return { tasks };
			},
			() => {
				console.log('After toggle: ', JSON.stringify(this.state.tasks[index]));
			}
		);
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
				{/* List of tasks */}
				<ul>
					{this.state.tasks.map((task, index) => (
						<li
							key={index}
							onClick={() => this.toggleTask(index)}
							style={{
								textDecoration: task.completed ? 'line-through' : 'none',
							}}
						>
							{task.text}
						</li>
					))}
				</ul>
			</div>
		);
	}
}
