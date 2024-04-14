import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { FaGithub } from "react-icons/fa";

function moveBubbles() {
  const bubbles = document.querySelectorAll('.bubble');
  const maxLeft = window.innerWidth; 
  const maxTop = window.innerHeight; 

  bubbles.forEach((bubble) => {
      const randomLeft = Math.random() * maxLeft;
      const randomTop = Math.random() * maxTop;

      bubble.style.left = `${randomLeft}px`;
      bubble.style.top = `${randomTop}px`;
  });
}


function App() {

  const generatedText = `Once upon a time, in a remote village nestled among misty mountains, there lived an old monk renowned for his wisdom. One day, a traveler sought his counsel, burdened with worries and seeking enlightenment. The monk, without a word, poured tea into the traveler's cup until it overflowed. Bewildered, the traveler exclaimed, "It's full! Stop!" The monk smiled gently, "Your mind is like this cup, overflowing with thoughts. Empty it, and you will find clarity." In that moment, the traveler understood—the path to peace lay not in accumulating, but in letting go. With a lighter heart, the traveler journeyed on.`;
  let expectedInput = generatedText.split('');
  let userInput = [];
  let duration = 15;
  let gameTime = duration * 1000;
  let [selectedDuration, setSelectedDuration] = useState(15);
  window.timer = null;
  window.gameStart = null;

  const handleKeyDown = (e) => {
    const key = e.key;

    if (key.length === 1) {
      userInput.push(key);
    }

    const currentIndex = userInput.length - 1;
    const expectedLetter = expectedInput[currentIndex];
    const userLetter = userInput[currentIndex];

    console.log("user letter: ", userLetter);
    console.log("expected letter: ", expectedLetter);
    const currentExpectedClass = `.letter${currentIndex}`;
    const currentLetter = document.querySelector(currentExpectedClass);

    // start timer
    if (!window.timer && currentLetter) {
      console.log("game time: ", gameTime);
      console.log("duration: ", duration);
      const timerBtn = document.querySelectorAll('.timerBtn');
      timerBtn.forEach((e) => {
        e.style.display = 'none';
      })

      const countdown = document.querySelector('#countdown');
      countdown.style.display = 'block';
      
      window.gameStart = (new Date()).getTime();
      window.timer = setInterval(() => {
        const currentTime = (new Date()).getTime();
        const mPassed = currentTime - window.gameStart;
        const sPassed = Math.round(mPassed / 1000);
        const sLeft = (gameTime / 1000) - sPassed;
        document.getElementById('countdown').innerHTML = sLeft + '';

        if (sLeft === 0) {
          clearInterval(window.timer);
          window.timer = null;
        }
      }, 1000);
    }

    if (key.length === 1 && currentIndex >= 0) {
      if (userLetter === expectedLetter && currentLetter) {
        console.log("correct");
        currentLetter.classList.add('correct');
      } else if (userLetter !== expectedInput) {
        console.log("incorrect");
        currentLetter.classList.add('incorrect');
      }
    } else if (key === 'Backspace' && currentIndex >= 0) {
      currentLetter.classList.remove('correct');
      currentLetter.classList.remove('incorrect');
      userInput.pop();
    }

    if (currentLetter) {
      const gameArea = document.querySelector('#gameArea');
      const gameAreaRect = gameArea.getBoundingClientRect();
      const currentLetterRect = currentLetter.getBoundingClientRect();
      const topOffsetFromGameArea = currentLetterRect.top - gameAreaRect.top;
      // move lines
      if (key.length === 1 && currentIndex >= 0 && topOffsetFromGameArea > 50) {
        const expectedInput = document.querySelectorAll('.expectedInput');
        expectedInput.forEach((e) => {
          const top = parseInt(e.style.top || '0px');
          e.style.top = (top - 35) + 'px';
        })
      }
    }

    // move cursor
    const cursor = document.querySelector('#cursor');
    if (currentLetter) {
      cursor.style.display = 'block';
      cursor.style.top = currentLetter.getBoundingClientRect().top + 1 + 'px';
      if (key !== 'Backspace') {
        cursor.style.left = currentLetter.getBoundingClientRect().left + 10 + 'px';
      } else {
        cursor.style.left = currentLetter.getBoundingClientRect().left + 'px';
      }
    }

    // focus
    const expectedInputId = document.querySelectorAll('.expectedInput');
    const focusError = document.querySelector('.focusError');

    expectedInputId.forEach((e) => {
      e.style.filter = 'blur(0)';
    })
    cursor.style.filter = 'blur(0)';
    focusError.style.opacity = '0';

  }

  const handleDurationChange = (newDuration) => {
    duration = newDuration;
    setSelectedDuration(newDuration);
    gameTime = newDuration * 1000;
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', () => {
      const expectedInputId = document.querySelectorAll('.expectedInput');
      const focusError = document.querySelector('.focusError');
      const cursor = document.querySelector('#cursor');

      if (expectedInputId) {
        expectedInputId.forEach((e) => {
          e.style.filter = 'blur(5px)';
        })
      }
      if (cursor) {
        cursor.style.filter = 'blur(5px)';
      }
      if (focusError) {
        focusError.style.opacity = '1';
      }
    })
    window.addEventListener('focus', () => {
      const expectedInputId = document.querySelectorAll('.expectedInput');
      const focusError = document.querySelector('.focusError');
      const cursor = document.querySelector('#cursor');

      if (expectedInputId) {
        expectedInputId.forEach((e) => {
          e.style.filter = 'blur(0)';
        })
      }
      if (cursor) {
        cursor.style.filter = 'blur(0)';
      }
      if (focusError) {
        focusError.style.opacity = '0';
      }
    })

    moveBubbles();
    const intervalId = setInterval(moveBubbles, 3000);

    return () => clearInterval(intervalId);

  })

  return (
    <div id='mainContainer' tabindex='0'>
      <div className='bubble bubbleOne'></div>
      <div className='bubble bubbleTwo'></div>
      <div className='header'>
        <img src={logo} alt="logo"/>
      </div>
      <div className='appArea'>
        <div>
          <select className='langDropDown' name='language' id='language'>
            <option value="eng">- English -</option>
            <option value="myn">- Burmese -</option>
          </select>
        </div>
        <div className='timer'>
          <button onClick={() => handleDurationChange(15)} className={`timerBtn ${selectedDuration === 15 ? "bold" : ""}`}>15</button>
          <button onClick={() => handleDurationChange(30)} className={`timerBtn ${selectedDuration === 30 ? "bold" : ""}`}>30</button>
          <button onClick={() => handleDurationChange(45)} className={`timerBtn ${selectedDuration === 45 ? "bold" : ""}`}>45</button>
          <button onClick={() => handleDurationChange(60)} className={`timerBtn ${selectedDuration === 60 ? "bold" : ""}`}>60</button>
          <div id='countdown'>{selectedDuration}</div>
        </div>
        <div id='gameArea'>
          <div className='focusError'>Start typing or click anywhere to focus</div>
          {expectedInput.map((letter, index) => (
            <span key={index} className={`expectedInput letter${index}`}>{letter}</span>
          ))}
          <div id='cursor'></div>
        </div>
      </div>
      <div className='footer'>
        <a href="https://github.com/erik-ksth" target="_blank" rel="noreferrer">created by Erik <FaGithub className="gitHubIcon"/></a>
      </div>
    </div>
  );
}

export default App;
