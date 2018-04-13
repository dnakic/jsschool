import React, { Component } from 'react';
import App from '../components/App';
import axios from 'axios';

class AppContainer extends Component {
	constructor() {
		super();

		this.state = {
			filterText: '',
			addText: '',
			isLoading: false,
			hasError: false,
			todos: []
		};
	}

	SERVER_PATH = "https://react.axilis.com/nakic/";
	GET_TODOS_PATH   = this.SERVER_PATH + "todos";
	DELETE_TODO_PATH = this.SERVER_PATH + "todo/";
	ADD_TODO_PATH    = this.SERVER_PATH + "todo";
	UPDATE_TODO_PATH = this.SERVER_PATH + "todo";

	async loadingAction (action) {
		this.setState({ isLoading: true });
		try {
			action();
		} catch (err) {
			this.setState({ hasError: true });
		} finally {
			this.setState({ isLoading: false });
		}
	}

	handleIsDoneToggle = async (todoId, isDone) => {
		this.setState({ isLoading: true });
		try {
			await axios.put(this.UPDATE_TODO_PATH, { id: todoId, isDone: isDone });
			this.setState({
				todos: this.state.todos.map((todo) => {
					if (todo.id === todoId) {
						return { ...todo, isDone: isDone };
					} else {
						return todo;
					}
				})
			});
		} catch (err) {
			console.log(err);
			this.setState({ hasError: true });
		} finally {
			this.setState({ isLoading: false });
		}
	};

	onFilterTextChanged = (text) => {
		this.setState({
			filterText: text
		});
	};

	onAddTextChanged = (text) => {
		this.setState({
			addText: text
		});
	};

	handleAddButtonClick = async () => {
		const text = this.state.addText;
		if (text.trim().length < 0) {
			return;
		}

		this.setState({ isLoading: true });
		try {
			let resp = await axios.post(this.ADD_TODO_PATH, { text: text });
			this.setState({
				addText: '',
				filterText: '',
				todos: [...this.state.todos, { id: resp.data.id, text: text, isDone: false }]
			});
		} catch (err) {
			this.setState({ hasError: true });
		} finally {
			this.setState({ isLoading: false });
		}
	};

	handleTrashClicked = async (todoId) => {
		this.setState({ isLoading: true });
		try {
			await axios.delete(this.DELETE_TODO_PATH + todoId);
			this.setState({
				todos: this.state.todos.filter((t) => t.id !== todoId)
			});
		} catch (err) {
			this.setState({ hasError: true });
		} finally {
			this.setState({ isLoading: false });
		}
	};

	async componentDidMount() {
		this.setState({ isLoading: true });
		try {
			let resp = await axios.get(this.GET_TODOS_PATH);
			this.setState({
				todos: resp.data
			});
		} catch (err) {
			this.setState({ hasError: true });
		} finally {
			this.setState({ isLoading: false });
		}
	}

	filter = (todos, filter) => {
		if (filter && filter.trim().length > 0) {
			return todos.filter((t) => t.text.indexOf(filter) > -1);
		}
		return todos;
	};

	render() {
		return (
			<App
				filterText={this.state.filterText}
				addText={this.state.addText}
				isLoading={this.state.isLoading}
				hasError={this.state.hasError}
				todos={this.filter(this.state.todos, this.state.filterText)}
				handleIsDoneToggle={this.handleIsDoneToggle}
				handleTrashClicked={this.handleTrashClicked}
				onFilterTextChanged={this.onFilterTextChanged}
				onAddTextChanged={this.onAddTextChanged}
				handleAddButtonClick={this.handleAddButtonClick}
			/>
		);
	}
}

export default AppContainer;
