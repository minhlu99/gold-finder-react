import { useState } from 'react';
import './App.css';
import Input from './components/Input';
import Introduction from './components/Introduction';
import MatrixTable from './components/MatrixTable';
import Timer from './components/Timer';


function App() {
  const [ size, setSize ] = useState(0)

  console.log(size)
  return (
    <div className="App">
      <div>

      <Input onStart={(_size) => {
          setSize(parseInt(_size))
        }} />
        <Introduction />
      </div>

        <MatrixTable rows={size} cols={size} />
    </div>
  );
}

export default App;
