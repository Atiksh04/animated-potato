import { useState } from 'react'
import './App.css'
import MentionComponent from './components/MentionContent';

function App() {

  return (
    <>
      <h2 className="heading">Mentions Component</h2>
      
      <MentionComponent
  value={"Initial value"}
  onChange={(newValue) => console.log("onchange handler",newValue)}
/>
    </>
  )
}

export default App
