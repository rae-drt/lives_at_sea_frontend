import './App.css';
import Person from './person.js';
import { Routes, Route, Navigate} from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to='/40001'/>}/>
        <Route path='/:nameId' element={<Navigate to='main'/>}/>
        <Route path='/:nameId/:dataType' element={<Person/>}/>
      </Routes>
    </div>
  );
}

export default App;
