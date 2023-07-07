import React from 'react';

export default class TodoList extends React.Component {
	constructor(props) {
		super(props);

		let tasks = []; //start with an empty list

		// Try to load from the localStorage
		const savedTasks = localStorage.getItem('tasks');

		if (savedTasks) {
			try {
				tasks = JSON.parse(savedTasks); // Parse the JSON string into an array
			} catch (e) {
				console.error('Failed to parse saved tasks:', e); // If parsing fails, log the error and keep the empty list
			}
		}

		// Initialize state with currentTask as an empty string and tasks as an empty array
		this.state = {
			currentTask: '',
			tasks: tasks, //either an empty list or whateve is in the localStorage
			error: null,
			filter: 'all',
		};

		// Bind 'this' to our methods
		this.updateCurrentTask = this.updateCurrentTask.bind(this);
		this.addTask = this.addTask.bind(this);
		this.toggleTask = this.toggleTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
	}

	updateCurrentTask(event) {
		// Update the currentTask state with the new input
		this.setState({ currentTask: event.target.value });
	}

	addTask(event) {
		// Prevent form from refreshing the page
		event.preventDefault();
		const task = this.state.currentTask;

		if (task === '') {
			this.setState({ error: 'Task cannot be empty.' });
		} else if (task.length > 100) {
			this.setState({ error: 'Task cannot be longer than 100 characters.' });
		} else {
			this.setState(
				prevState => ({
					tasks: [...prevState.tasks, { text: task, completed: false }],
					currentTask: '',
					error: null,
				}),
				() => {
					localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
				}
			);
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
				// After state update, save the tasks array to localStorage
				localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
			}
		);
	}

	deleteTask(index) {
		console.log('DELETED!!');
		this.setState(
			prevState => {
				// Filter out the task at the given index
				const tasks = prevState.tasks.filter(
					(task, taskIndex) => taskIndex !== index
				);
				return { tasks };
			},
			() => {
				// After state update, save the tasks array to localStorage
				localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
			}
		);
	}

	updateFilter(filter) {
		this.setState({ filter });
	}

	render() {
		// Filter tasks based on the current filter
		let tasksToRender;

		// Check if any tasks are completed
		const anyTasksCompleted = this.state.tasks.some(task => task.completed);

		switch (this.state.filter) {
			case 'completed':
				tasksToRender = anyTasksCompleted
					? this.state.tasks.filter(task => task.completed)
					: this.state.tasks;
				break;
			case 'incomplete':
				tasksToRender = this.state.tasks.filter(task => !task.completed);
				break;
			default:
				tasksToRender = this.state.tasks;
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
					{/* Display the error message */}
					{this.state.error && <p>{this.state.error}</p>}
				</form>
				{/* Buttons for changing filter*/}
				<div>
					<button onClick={() => this.updateFilter('all')}>All</button>
					<button onClick={() => this.updateFilter('completed')}>
						Completed
					</button>
					<button onClick={() => this.updateFilter('incomplete')}>
						Incomplete
					</button>
				</div>

				{/* List of tasks */}
				<ul>
					{tasksToRender.map((task, index) => (
						<li
							key={index}
							onClick={() => this.toggleTask(index)}
							style={{
								textDecoration: task.completed ? 'line-through' : 'none',
							}}
						>
							{task.text}
							<button
								onClick={event => {
									event.stopPropagation(); // Stop the event from bubbling up to the li
									this.deleteTask(index);
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
