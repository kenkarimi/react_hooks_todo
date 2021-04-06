import React, { useState } from 'react';
import './App.css';

function Todo({ todo, index, completeTodo, removeTodo}) {
  return (
    <div className="todo" style={{textDecoration: todo.isCompleted ? 'line-through' : ''}}>
      <div>
        <button onClick={() => completeTodo(index)}>Complete</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
      <p>{ todo.text }</p> 
    </div>
  )
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!value) return;
    addTodo(value);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className="input" placeholder="Add Todo..." value={value} onChange={e => setValue(e.target.value)} />
    </form>
  )
}

function User({ state, changeState }) {
  return (
    <div className="broad_state">
      <div>
        <button onClick={() => changeState()}>Change State</button>
      </div>
      <p>{ state.fullname }</p><br/>
      <p>{ state.email }</p><br/>
      <p>{ state.phone }</p><br/>
      <p>{ state.decodedClaims.uid }</p><br/>
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

  const [state, setState] = useState({
    fullname: 'Kennedy Mugera Karimi',
    email: 'kennedymugera@gmail.com',
    phone: '0702466037',
    decodedClaims: { uid: '30533847' },
    locations: [0,1,2,3,4,5]
  });

  const addTodo = (text) => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);
  }

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  }

  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  }

  const changeState = () => {
    console.log('Initial state...');
    console.log(state);

    /*you *must* use spread operator to get everything from the initial state onto a new updateable state object.
     This (updateable_state = state) wouldn't have completely worked because after you update the updateable state with Ephraims details,
     The state does change as expected but it doesn't update on the interface for whatever reason(state seems to change without triggering an interface update)
    */
    
    let updateable_state = { ...state }; 

    updateable_state.fullname = 'Ephraim Wachira';
    updateable_state.email = 'ephywachira@gmail.com';
    updateable_state.phone = '0722639870';
    updateable_state.decodedClaims.uid = 'NOT AVAILABLE';
    updateable_state.locations = [6,7,8,9,10];

    //Appropriate for use in situations where you *need* to use the state immediately after update.
    //If you need to use the state immediately after update use the 'updateable_state' variable since the 'state' variable is updated asynchronously and isn't available immediately.

    setState(updateable_state);
    console.log('Updated state...');
    console.log(state);

    //Alternatively, you could just do this:
    //Appropriate for use in situations where you don't need to use the state immediately after update.
    
    /*setState({
      ...state,
      fullname: 'Nancy Nyaguthii',
      email: 'pst.nancynyaguthii@gmail.com',
      phone: '0724912647',
      decodedClaims: {uid: '1063058'}
    },
      console.log('Updated state...'),
      console.log(state)
    );
    console.log('Updated state...');
    console.log(state);*/
  }

  return (
    <div className="app">
      <div className="todo-list">
          {
            todos.map( (todo, index) => (
                <Todo 
                  key={index}
                  index={index}
                  todo={todo}
                  completeTodo={completeTodo}
                  removeTodo={removeTodo}
                />
            ))
          }
          <TodoForm 
            addTodo={addTodo}
          />
          <User
            state={state}
            changeState={changeState}
          />
      </div>
    </div>
  );
}

export default App;