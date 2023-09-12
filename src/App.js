import React, { useEffect, useState } from 'react';
import audioData from './audioDataURL.json'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';

export default function App(){
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = audioData[currentTrackIndex];
 
  useEffect(function(){

  }, [currentTrack])
    return(
        <div className='container'>
        <h1 className='podcast-title'>{currentTrackIndex+1}/100. {currentTrack.Title}</h1>
        <AudioPlayer currentTrackIndex={currentTrackIndex} setCurrentTrackIndex={setCurrentTrackIndex} currentTrack={currentTrack} />
        <span><h6>English Summary :</h6><p>{currentTrack.English_Description}</p></span>
        <span><h6>Hindi Summary :</h6><p>{currentTrack.Hindi_Description}</p></span>
        <h2 className='form-title'>Evaluate Summary</h2>
        <FeedBackForm currentTrackIndex={currentTrackIndex} setCurrentTrackIndex={setCurrentTrackIndex} currentTrack={currentTrack}/>
        </div>
    )
}

function AudioPlayer({currentTrackIndex, setCurrentTrackIndex, currentTrack}) {
    const playNextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % audioData.length;
        setCurrentTrackIndex(nextIndex);
      };
    
      const playPreviousTrack = () => {
        const previousIndex = (currentTrackIndex - 1 + audioData.length) % audioData.length;
        setCurrentTrackIndex(previousIndex);
      };
    return (
      <div className='container'>
        {audioData.length > 0 && (
          <div>
            {/* <audio controls src={currentTrack.URL} type="audio/mpeg">
              Your browser does not support the audio element.
            </audio> */}
            <iframe width="420" height="315" title={currentTrack.Title}
                   src={currentTrack.URL}>
            </iframe>
            <br></br>
            <button className='button-previous' onClick={playPreviousTrack}>Previous</button>
            <button className='button-next' onClick={playNextTrack}>Next</button>
          </div>
        )}
      </div>
    );
  };
  
function FeedBackForm({currentTrackIndex, setCurrentTrackIndex, currentTrack}){
    const options = ['Very Good', 'Good', 'Barely Acceptable', 'Poor', 'Very Poor'];
    const [formAnswers, setFormAnswers] = useState({});
    const initialFeedback = [
        { question: 'Referential clarity', options: options, selectedOption: '', meaning:'It should be easy to identify who or what the pronouns and noun phrases in the summary are referring to. If a person or other entity is mentioned, it should be clear what their role in the story is. So, a reference would be unclear if an entity is referenced but its identity or relation to the story remains unclear.' },
        { question: 'Focus', options: options, selectedOption: '', meaning:'The summary should have a focus; sentences should only contain information that is related to the rest of the summary.' },
        { question: 'Structure and Coherence', options: options, selectedOption: '', meaning:'The summary should be well-structured and well-organized. The summary should not just be a heap of related information, but should build from sentence to sentence to a coherent body of information about a topic.' },
        { question: 'Grammaticality', options: options, selectedOption: '', meaning:'The summary should have no datelines, system-internal formatting, capitalization errors or obviously ungrammatical sentences (e.g.,fragments, missing components) that make the text difficult to read' },
        { question: 'Non-redundancy', options: options, selectedOption: '', meaning:'There should be no unnecessary repetition in the summary. Unnecessary repetition might take the form of whole sentences that are repeated, or repeated facts, or the repeated use of a noun or noun phrase (e.g., "Bill Clinton") when a pronoun ("he") would suffice.' },
      ];
      
      const [feedback, setFeedback] = useState(initialFeedback);
      useEffect(() => {
        // Retrieve formAnswers from localStorage on component mount
        const storedFormAnswers = localStorage.getItem('formAnswers');
        if (storedFormAnswers) {
          setFormAnswers(JSON.parse(storedFormAnswers));
        }
      }, []);
    
      useEffect(() => {
        // Store formAnswers in localStorage whenever it changes
        localStorage.setItem('formAnswers', JSON.stringify(formAnswers));
      }, [formAnswers]);
    
      const handleOptionChange = (questionIndex, optionIndex) => {
        setFeedback((prevFeedback) => {
          const updatedFeedback = [...prevFeedback];
          updatedFeedback[questionIndex].selectedOption = optionIndex;
          return updatedFeedback;
        });
      };
      
      function submitToGoogleForm(formAnswers) {

            const formData ={
                Identifier:currentTrack.Identifier,
                Title:currentTrack.Title,
                Referential_clarity:Number(formAnswers[0].selectedOption)+1,
                Focus:Number(formAnswers[1].selectedOption)+1,
                Structure:Number(formAnswers[2].selectedOption)+1,
                Grammaticality:Number(formAnswers[3].selectedOption)+1,
                Non_redundancy:Number(formAnswers[4].selectedOption)+1,
                
            }
            // console.log(formAnswers);
            // // fetch(
            //   "https://script.google.com/macros/s/AKfycbwscWxa8TfXdirVsHZw-nZSIn-Jhc0GseoI0nqqvToFFt5TbB6RpV3K1e4pjoo55D8c/exec",
            //   {
            //     method: "POST",
            //     mode: "no-cors",
            //     body: formData
            //   }
            // )
            //   .then((res) => res.text())
            //   .then((data) => {
            //     console.log(data);
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });
            axios.post('https://sheet.best/api/sheets/199cd242-ce9f-4e97-ae87-d7161187b287',formData).then((response)=>console.log(response));
      }
      

      const handleSubmit = (event) => {
        event.preventDefault();
        // Process the submitted feedback
        console.log(feedback[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const nextIndex = (currentTrackIndex + 1) % audioData.length;
        const formData = new FormData(event.target);
        // Extract form answers from the FormData
        const answers = {};
        for (let pair of formData.entries()) {
        const [question, answer] = pair;
        answers[question] = answer;
        }
        setFormAnswers((prevFormAnswers) => ({
            ...prevFormAnswers,
            [currentTrack.Title]: answers,
          }));      
        setCurrentTrackIndex(nextIndex);
        submitToGoogleForm(feedback);
        setFeedback(initialFeedback);
      };

      // function handleNameChange(e){
      //   setUser(user=>e.target.value);
      // }
    
      return (
        <>
            
        <form onSubmit={handleSubmit} action="https://script.google.com/macros/s/AKfycbwscWxa8TfXdirVsHZw-nZSIn-Jhc0GseoI0nqqvToFFt5TbB6RpV3K1e4pjoo55D8c/exec" method="post">
              {/* <label>User </label>
              <input
                type="text"
                value= {user}
                onChange={e=>handleNameChange(e)}>
                </input> */}
          {feedback.map((question, questionIndex) => (
            <div className='question-box' key={questionIndex}>
              <h5 className='question'>{question.question}</h5>
              <em>{question.meaning}</em>
              <br></br>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={optionIndex}
                    checked={question.selectedOption === optionIndex}
                    onChange={() => handleOptionChange(questionIndex, optionIndex)}
                    required
                  />
                  <span className='option'>{option}</span> 
                  </label>
              ))}
            </div>
          ))}
    
          <button className = 'button-submit' type="submit">Submit</button>
        </form>
        {/* <pre>{JSON.stringify(formAnswers, null, 2)}</pre> */}
        </>
      );
    };

    