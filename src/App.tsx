import './App.css'
import MentionComponent from './components/MentionComponent/MentionComponent';

function App() {

  return (
    <>
      <h2 className="heading">Mentions Component</h2>    
      <MentionComponent
        value={"Initial value passed from parent component"}
        onChange={(newValue) => console.log("onchange handler",newValue)}
      />
    </>
  )
}

export default App
