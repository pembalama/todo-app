import React from 'react';

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		let tasks = []; // Initialize an empty task array

		// Try to get the tasks from localStorage
		const savedTasks = localStorage.getItem('tasks');

		// If tasks exist in localStorage, try to parse them
		if (savedTasks) {
			try {
				tasks = JSON.parse(savedTasks); // Parse the saved tasks
			} catch (e) {
				console.error('Failed to parse saved tasks:', e); // Log an error if parsing failed
			}
		}

		// Initialize the state
		this.state = {
			currentTask: '', // Current task is initially an empty string
			tasks: tasks, // Tasks are either the parsed tasks from localStorage or an empty array
			error: null, // No error initially
			filter: 'all', // Show all tasks initially
			searchTerm: '', // Search term is initially an empty string
		};

		// Bind 'this' to our methods
		this.updateCurrentTask = this.updateCurrentTask.bind(this);
		this.addTask = this.addTask.bind(this);
		this.toggleTask = this.toggleTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.updateSearchTerm = this.updateSearchTerm.bind(this);
		this.clearTasks = this.clearTasks.bind(this);
	}

	updateCurrentTask(event) {
		// Update the currentTask state with the new input
		this.setState({ currentTask: event.target.value });
	}

	addTask(event) {
		// Prevent form from refreshing the page on submit
		event.preventDefault();
		const task = this.state.currentTask;

		// Check the length of the task before adding it
		if (task === '') {
			this.setState({ error: 'Task cannot be empty.' });
		} else if (task.length > 100) {
			this.setState({ error: 'Task cannot be longer than 100 characters.' });
		} else {
			this.setState(
				prevState => ({
					// Add the new task to the tasks array
					tasks: [
						...prevState.tasks,
						{ id: Date.now(), text: task, completed: false },
					],
					currentTask: '', // Clear the currentTask input
					error: null, // Clear any errors
				}),
				() => {
					// After state update, save the tasks array to localStorage
					localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
				}
			);
		}
	}

	toggleTask(id) {
		// Toggle the completed status of the task with the given id
		this.setState(
			prevState => {
				const tasks = prevState.tasks.map(task => {
					if (task.id === id) {
						// This is the task we clicked, so toggle its completed status
						return { ...task, completed: !task.completed };
					} else {
						// This is not the task we clicked, so leave it as is
						return task;
					}
				});

				return { tasks }; // Update the tasks array in the state
			},
			() => {
				// After state update, save the tasks array to localStorage
				localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
			}
		);
	}

	deleteTask(id) {
		// Delete the task with the given id
		this.setState(
			prevState => {
				const tasks = prevState.tasks.filter(task => task.id !== id); // Filter out the task to be deleted

				return { tasks }; // Update the tasks array in the state
			},
			() => {
				// After state update, save the tasks array to localStorage
				localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
			}
		);
	}

	updateFilter(filter) {
		// Update the filter state with the new filter
		this.setState({ filter });
	}

	updateSearchTerm(event) {
		// Update the searchTerm state with the new input
		this.setState({ searchTerm: event.target.value });
	}

	clearTasks() {
		//Check if user confirms deletion of all tasks
		if (window.confirm('Are you sure you want to delete all tasks?')) {
			// If confirmed, set tasks array to an empty array and remove from localStorage
			this.setState({ tasks: [] }, () => {
				localStorage.removeItem('tasks');
			});
		}
	}

	render() {
		// Copy the tasks array from the state
		let tasksToRender = [...this.state.tasks];

		if (this.state.searchTerm) {
			// Filter tasks based on the search term
			tasksToRender = tasksToRender.filter(task =>
				task.text.toLowerCase().includes(this.state.searchTerm.toLowerCase())
			);
		}

		switch (this.state.filter) {
			case 'completed':
				// Filter tasks to only completed ones
				tasksToRender = tasksToRender.filter(task => task.completed);
				break;
			case 'incomplete':
				// Filter tasks to only incomplete ones
				tasksToRender = tasksToRender.filter(task => !task.completed);
				break;
			default:
				// By default show all tasks
				break;
		}

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
					<button type="button" onClick={this.clearTasks}>
						Clear All Tasks
					</button>
					{/* Display the error message */}
					{this.state.error && <p>{this.state.error}</p>}
				</form>
				{/* Buttons for changing filter*/}
				<div>
					<button
						onClick={event => {
							event.stopPropagation();
							this.updateFilter('all');
						}}
					>
						All
					</button>
					<button
						onClick={event => {
							event.stopPropagation();
							this.updateFilter('completed');
						}}
					>
						Completed
					</button>
					<button
						onClick={event => {
							event.stopPropagation();
							this.updateFilter('incomplete');
						}}
					>
						Incomplete
					</button>
				</div>

				{/* List of tasks */}
				<input
					type="text"
					placeholder="Search tasks"
					value={this.state.searchTerm}
					onChange={this.updateSearchTerm}
				/>
				<ul>
					{tasksToRender.map(task => (
						<li
							key={task.id}
							onClick={() => this.toggleTask(task.id)}
							style={{
								textDecoration: task.completed ? 'line-through' : 'none',
							}}
						>
							{task.text}
							<button
								onClick={event => {
									event.stopPropagation(); // Stop the event from bubbling up to the li
									this.deleteTask(task.id);
								}}
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
