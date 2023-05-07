/* Importing stuff */
import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { ReactComponent as NoTasksSVG } from "../svg/no_todos.svg";

function TodoLogic() {
	/* STATES, EFFECTS AND CONSTANTS */
	/* Creating some states */
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState("");
	const { user } = useAuthContext();

	const API_BASE = "http://localhost:3001";  // connecting to the server

	/* Refreshing the page with the current todos */
	useEffect(() => {
		async function getTodos() {
			try {
				const response = await fetch(`${API_BASE}/todos`, {
					headers: {
						"Authorization": `Bearer ${user.token}`,
					},
				});

				const data = await response.json();
				setIsLoading(false);
				setTodos(data);

			} catch (error) {
				console.error(error);
			}
		}

		if (user && user.token) {
			getTodos();
		}
	}, [user]);



	/* ACTIONS ON TODOS */
	/* Complete a todo function */
	const completeTodo = async (id) => {
		try {
			const response = await fetch(API_BASE + "/todo/complete/" + id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${user.token}`
				},
				body: JSON.stringify({ id }),
			});

			if (response.ok) {
				const data = await response.json();
				setTodos((todos) =>
					todos.map((todo) => {
						if (todo._id === data._id) {
							todo.complete = data.complete;
						}
						return todo;
					})
				);
			} else {
				console.error("Something didn't quite workout!!!")
			}
		} catch (error) {
			console.error(error);
		}
	};

	/* Delete a todo function */
	const deleteTodo = async (id) => {
		try {
			if (window.confirm("Are you sure you want to delete this task?")) {
				await fetch(`${API_BASE}/todo/delete/${id}`, {
					method: "DELETE",
					headers: {
						"Authorization": `Bearer ${user.token}`
					}
				});

				setTodos(todos => todos.filter(todo => todo._id !== id)); // creating a new filtered todo array
			}
		} catch (error) {
			console.error(error);
		}
	};


	/* Add a todo */
	const addTodo = async (text) => {
		try {
			const response = await fetch(`${API_BASE}/todo/new`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${user.token}`,
				},
				body: JSON.stringify({ text }),
			});

			if (response.ok) {
				const data = await response.json();
				setTodos([...todos, data]); // add the new todo to the existing todo array
			} else {
				console.error("Something went wrong!");
			}
		} catch (error) {
			console.error(error);
		}
	};


	/* Edit a todo */
	const editTodo = async (id, text) => {
		try {
			const response = await fetch(`${API_BASE}/todo/edit/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${user.token}`
				},
				body: JSON.stringify({ text }),
			});

			if (response.ok) {
				const data = await response.json();
				setTodos(todos.map((todo) => (todo._id === id ? { ...todo, text: data.text } : todo))  // basically updating only the relevant todo task
				);
			} else {
				console.error("Something went wrong!");
			}
		} catch (error) {
			console.error(error);
		}
	};


	/* Handling a double-click on a todo */
	const handleTodoDoubleClick = (id, currentText, event) => {
		const newTodoText = window.prompt("Edit the todo:", currentText);
		if (newTodoText) {
			editTodo(id, newTodoText);
		}
		event.stopPropagation();
	}
	let timer;  // this is a variable used to differ between a single click and a double-click


	/* Finding the firstname of the logged user */
	const firstName = () => {
		try {
			let userData = window.localStorage.getItem('user');
			let parsedUserData = JSON.parse(userData);
			let myArray = parsedUserData.user.name.split(" ");
			let fName = myArray[0].toString();

			return fName;
		} catch {
			return null;
		}
	}

	return (
		<div onClick={(e) => { if (e.target.classList.contains('popup')) { setPopupActive(false); } }} >
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>


			<h4>{firstName() ? `${firstName()}'s Tasks` : ''}</h4>

			{/* Checking if there are any todos, if not display an svg with a message */}
			{isLoading ? (
				<div className="loading-animation-container">
					<lottie-player src="https://assets10.lottiefiles.com/packages/lf20_x62chJ.json" background="transparent" speed="1" className="loading-animation" loop autoplay></lottie-player>
				</div>
			) :
				(todos.length !== 0 ? (
					<div className="todos">
						{todos.map(todo => (
							<div className={"todo " + (todo.complete ? "is-complete" : "")}  // checking if a todo is completed so I can cascade it

								onClick={(event) => {
									if (event.detail === 1) {
										timer = setTimeout(() => {
											completeTodo(todo._id);
										}, 200)
									}
								}}

								onDoubleClick={(event) => {
									clearTimeout(timer);
									handleTodoDoubleClick(todo._id, todo.text, event);
								}}
							>

								<div className="checkbox"></div>

								<div className="text">{todo.text}</div>

								<div className="delete-todo" onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id) }}><i className="fa fa-trash-o"></i></div>

							</div>
						))}

					</div>
				) : (

					<div>
						<NoTasksSVG className="no-todos-svg" />
						<h3 className="no-todos-message">Let's go! Add A Task!</h3>
					</div>
				)
				)}


			<div className="addPopup" onClick={() => { setPopupActive(true); setNewTodo("") }}><i className="fas fa-pen"></i></div>


			{/* If a popup is active (client pressed add a todo), then do as below */}
			{popupActive ? (
				<div className="popup">

					<div className="content">

						<h3>Add Task</h3><br />

						<input
							type='text'

							className='add-todo-input'

							onChange={textEntered => setNewTodo(textEntered.target.value)}

							onKeyDown={(event) => {
								if (event.key === 'Enter' && newTodo) {
									addTodo(newTodo);
									setPopupActive(false);
								}
							}}

							value={newTodo}

							placeholder='What would you like to achieve today?'
						/>

					</div>

					<div className="addButton" onClick={() => {
						if (newTodo.trim() !== '') { // add todo only if it has value
							addTodo(newTodo);
							setPopupActive(false);
						}
					}} >
						<i className="fa fa-check"></i>
					</div>

				</div>
			) : ""}


		</div>
	);
}

export default TodoLogic;