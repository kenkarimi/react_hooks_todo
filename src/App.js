import React, { useState } from 'react';
import './App.css';

function Todo({ todo, index}) {
  return (
    <div className="todo">
      <p>{ todo.text }</p> 
    </div>
  )
}

function App(){
  const [todos, setTodos] = useState([
    {
      text: 'Learn about react',
      isCompleted: false
    },
    {
      text: 'Meet friend for lunch',
      isCompleted: false
    },
    {
      text: 'Build really cool todo app',
      isCompleted: false
    }
  ]);

  return (
    <div className="app">
      <div className="todo-list">
        <h1>My Todos</h1>
          {
            todos.map( (todo, index) => (
                <Todo 
                  key={index}
                  index={index}
                  todo={todo}
                />
            ))
          }
      </div>
    </div>
  );
}

export default App;