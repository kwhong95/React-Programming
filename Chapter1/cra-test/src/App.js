import './App.css';
import ToDoList from "./TodoList";

function App() {
    console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

    console.log(`REACT_APP_DATA_API = ${process.env.REACT_APP_DATA_API}`);
    console.log(`REACT_APP_LOGIN_API = ${process.env.REACT_APP_LOGIN_API}`);

  return (
    <div className="App">
      <ToDoList />
    </div>
  );
}

export default App;
