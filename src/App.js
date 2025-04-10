import './App.css';
import Person from './person';
import Search from './search';
import { Routes, Route, Navigate} from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={process.env.PUBLIC_URL}>
          <Route path='' element={<Navigate to='rating/40001'/>}/>
          <Route path='search' element={<Navigate to='rating'/>}/>
          <Route path='search/:sailorType' element={<Search/>}/>
          <Route path='rating' element={<Navigate to='40001'/>}/>
          <Route path='officer' element={<Navigate to='7'/>}/>
          <Route path='rating/:nameid' element={<Navigate to='main'/>}/>
          <Route path='officer/:nameid' element={<Navigate to='otherservices'/>}/>
          <Route path=':sailorType/:nameId/:dataType' element={<Person/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
