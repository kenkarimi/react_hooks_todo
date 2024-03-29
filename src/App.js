import React, { useState, useEffect, createContext, useContext, useRef, useReducer } from 'react';
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

/*
The Context API is a component structure provided by the React framework, which enables us to share specific forms of data across all levels of the application.
 It’s aimed at solving the problem of prop drilling.
 “Prop drilling (also called “threading”) refers to the process you have to go through to get data to parts of the React Component tree.” – Kent C. Dodds.
 Before the Context API, we could use a module to solve this, which led to the increasing popularity of state management libraries like Redux.
 Libraries like Redux allows you to get data from the store easily, anywhere in the tree. Example below.
*/

/*
  The Context API is useful for sharing data that can be considered global, such as the currently authenticated user, the theme settings for the application, and more.
  In situations where we have these types of data, we can use the Context API and we don’t necessarily have to use extra modules.
*/

const themes = {
  light: {
    foreground: "#25AF94",
    background: "#ED3237"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = createContext(themes.light);

function User({ state, changeState, changeStateBack }) {
  const theme = useContext(ThemeContext);

  useEffect( () => { //This is the equivalent of a componentDidUpdate. Executes everytime the component changes (props or state changes).
    console.log('state/props has just updated...');
    //console.log(state);
    //changeStateBack();
    return () => {/*This runs only after the component unmounts(this.mount === false)*/
      console.log('this.mount is now false');
    }
  }, []);

  /*NB: Regarding Mounting/Unmounting
  If a component existed but no longer will, it's considered unmounted and given the chance to do so and clean up with componentWillUnmount. e.g. when details change from Kennedy to Ephraim after change state is clicked, an unmount happens after the click.
  The reverse is true. If a component didn't exist but now does, it's considered ready to mount and given a chance to do so with a constructor/componentWillMount.
  In class components, I've issually used a constructor to mount comonents in the past.
  */

  useEffect( () => { /*This is the equivalent of a componentDidUpdate and executes only once after the component mounts and then each time the specific prop/state we're watchiing for(in this case 'state') changes.*/
    console.log('The \'state\' object we\'re watching for in this particular useEffect has changed.')
  }, [state]);

  useEffect( () => { /*This is the equivalent of a componentDidUpdate and executes only once after the component mounts and then each time the specific prop/state we're watchiing for(in this case 'state.fullname') changes.*/
    console.log('The \'state.fullname\' object we\'re watching for in this particular useEffect has changed.')
  }, [state.fullname]); //Note: You can only watch for changes in a specific property in an object if you changed the state using the second alternative method (without the updateable_state variable)

  return (
    <div className="broad_state">
      <div>
        <button onClick={() => changeState()} style={{ background: theme.background, color: theme.foreground }}>Change State</button>
      </div>
      <p>{ state.fullname }</p><br/>
      <p>{ state.email }</p><br/>
      <p>{ state.phone }</p><br/>
      <p>{ state.decodedClaims.uid }</p><br/>
    </div>
  )
}

/*A custom Hook is a JavaScript function whose name starts with ”use” and that may call other Hooks.*/
/*aditionally in React, we’ve had two popular ways to share stateful logic between components: render props and higher-order components.
 We will now look at how Hooks solve many of the same problems without forcing you to add more components to the tree.
*/
/*Building your own Hooks lets you extract component logic into reusable functions.*/
function useFocusForm(context, reference) {
  const theme = useContext(context);
  const focusInput = useRef(reference);

  return { theme: theme, focusInput: focusInput }
}

/*useRef allows you to create a reference to and allows you to manipulate a DOM element*/
function FocusForm() {

  const results = useFocusForm(ThemeContext, null);

  const focusOnTextBox = (e) => {
    e.preventDefault();
    results.focusInput.current.focus();
  }

  const funButton = (e, arg) => {
    e.preventDefault();
    console.log('This button has been CLICKED '+ arg);
  }

  return (
    <div>
      <input type="text" ref={results.focusInput} className="input" />
      <button onClick={focusOnTextBox} style={{ background: results.theme.background, color: results.theme.foreground }}>Ref Focus Button</button>
      <button onClick={(e) => funButton(e, 'Argument also passed')} style={{ background: results.theme.background, color: results.theme.foreground }}>Fun Argument Button</button>
    </div>
  );
}

const reducer = (state, action) => {
  if(action.type === 'INCREMENT_AGE'){ //can alternatively use a switch statement as seen here: https://react.dev/reference/react/useReducer
    return {
      age: state.age + 1,
      name: state.name
    };
  } else if(action.type === 'CHANGE_NAME'){
    return {
      ...state, //You can also use the spread operator (...state) if there are to many other key-value pairs and you don't want to include them all.
      name: action.nextName
    };
  }
  throw Error('Unknown Action');
}

const Counter = () => {

  const [state, dispatch] = useReducer(reducer, { age: 29, name: 'Jane Doe' });

  const handleClick = () => {
    dispatch({ type: 'INCREMENT_AGE'});
  }

  const handleInputChange = (e) => {
    dispatch({ type: 'CHANGE_NAME', nextName: e.target.value })
  }

  return (
    <div>
      <h1>Hello! Are you {`${state.age}`}? Is your name {`${state.name}`}?</h1>
      <button onClick={handleClick}>Increment Age</button>
      <input type="text" onChange={handleInputChange} />
    </div>
  )
}

const higherOrderComponent = (Child, permission) => {

  const NewComponent = (props) => { //has to be either a function component beginning with a capital letter or a custom hook beginning with 'use'
    const [counter, setCounter] = useState(1);

    if(permission === false){
      return (
        <div>
          <h1>You don't have permission to access this route. {''+ counter}</h1>
          <br/>
          <button onClick={() => setCounter(counter + 1)}>Increment Counter</button>
        </div>
      );
    } else if(permission === true){
      return ( //message is sent down as a prop to the child component being rendered. We deconstruct it thereApp({ name }), but could also have used props.message
        <Child
          message="You have permission to access this route."
          {...props} //In case there were any othe props passed to the App function component(like so <App name='Doe' />) from another component, this makes sure they aren't forgotten and pass back to the NewComponent that's about to be returned. This step is necessary because App is being passed to a HOC, otherwise it wouldn't be necessary.
        />
      );
    } 
  }

  return NewComponent;
}

function App({ message }){
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

  /*Similar to componentDidMount, componentDidUpdate and componentWillUnmount combined.
    You can use more than one useEffect hook in a single functional component.
  */
  useEffect( () => { /*This is the equivalent of a componentDidMount and executes only once after the component mounts. Notice that the second variable in the useEffect is an empty array, which basically means we're not watching for any state/prop varilable. This is what makes it a componentDidMount.*/
    document.title = 'TODO App';
    console.log('componentDidMount use effect updated again...');
  }, []);

  useEffect( () => { /*This is the equivalent of a componentDidUpdate and executes only once after the component mounts and then each time the specific prop/state we're watchiing for(in this case 'todos') changes.*/
    console.log('The \'todos\' object we\'re watching for in this particular useEffect has changed.')
  }, [todos]);

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
    
    /*let updateable_state = { ...state };

    updateable_state.fullname = 'Ephraim Wachira';
    updateable_state.email = 'ephywachira@gmail.com';
    updateable_state.phone = '0722639870';
    updateable_state.decodedClaims.uid = 'NOT AVAILABLE';
    updateable_state.locations = [6,7,8,9,10];

    //Appropriate for use in situations where you *need* to use the state immediately after update.
    //If you need to use the state immediately after update use the 'updateable_state' variable since the 'state' variable is updated asynchronously and isn't available immediately.

    setState(updateable_state);
    console.log('Updated state...');
    console.log(state);*/

    //Alternatively, you could just do this:
    //Appropriate for use in situations where you don't need to use the state immediately after update.
    
    setState({
      ...state,
      //fullname: 'Nancy Nyaguthii',
      email: 'pst.nancynyaguthii@gmail.com',
      phone: '0724912647',
      decodedClaims: {uid: '1063058'}
    });
    console.log('Updated state...');
    console.log(state);
  }

  useEffect( () => {
    console.log('Updated again state...');
    console.log(state);
  }, [state.email]);

  const changeStateBack = () => {
    setState({
      ...state,
      fullname: 'Updated Kennedy Mugera Karimi',
      email: 'kennedymugera@gmail.com',
      phone: '0702466037',
      decodedClaims: {uid: '30533847'}
    });
    console.log('Updated state back to original...');
    console.log(state);
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
            changeStateBack={changeStateBack}
          />
          <FocusForm />
          <Counter />
          <br/>
          <p1>{message}</p1>
      </div>
    </div>
  );
}

export default higherOrderComponent(App, true); //boolean permission to access route.