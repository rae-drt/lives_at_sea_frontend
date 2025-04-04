import './App.css';
import Person from './person.js';
import { Routes, Route, Navigate} from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to='/rating/40001'/>}/>
        <Route path='/rating' element={<Navigate to='/rating/40001'/>}/>
        <Route path='/officer' element={<Navigate to='/officer/7'/>}/>
        <Route path='/rating/:nameid' element={<Navigate to='main'/>}/>
        <Route path='/officer/:nameid' element={<Navigate to='otherservices'/>}/>
        <Route path='/:sailorType/:nameId/:dataType' element={<Person/>}/>
      </Routes>
    </div>
  );
}

export default App;
