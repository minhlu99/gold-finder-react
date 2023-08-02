import './App.css';
import Input from './components/Input';
import Introduction from './components/Introduction';
import MatrixTable from './components/MatrixTable';
import Timer from './components/Timer';


function App() {
  return (
    <div className="App">
        <Input onStart={(size) => {
          console.log('start game with' + size + ' size')
        }} />
        <Introduction />
        <MatrixTable/>
    </div>
  );
}

export default App;
