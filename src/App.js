import './App.css';
import ServiceRecord from './servicerecord.js';
import { Routes, Route, Navigate} from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to='/40001'/>}/>
        <Route path='/:nameId' element={<ServiceRecord/>}/>
      </Routes>
    </div>
  );
}

export default App;
