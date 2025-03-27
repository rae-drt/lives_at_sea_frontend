import './App.css';
import Extras from './extras.js';
import ServiceRecord from './servicerecord.js';
import { Routes, Route, Navigate} from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to='/rating/40001'/>}/>
        <Route path='/rating/:nameId' element={<ServiceRecord/>}/>
        <Route path='/rating/extras/:nameId' element={<Extras/>}/>
      </Routes>
    </div>
  );
}

export default App;
