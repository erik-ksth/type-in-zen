import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { FaGithub } from "react-icons/fa";
import { RiRestartLine } from "react-icons/ri";
import runChat from "./textgenerator";

function moveBubbles() {
  const bubbles = document.querySelectorAll(".bubble");
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
  let documentFocus = false;

  const [generatedText, setGeneratedText] = useState("");
  const [expectedInput, setExpectedInput] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedText = async () => {
      const text = await runChat();
      setGeneratedText(text);
      setLoading(false);
    };

    fetchGeneratedText();
  }, []);

  useEffect(() => {
    if (generatedText) {
      setExpectedInput(generatedText.split(""));
    }
  }, [generatedText]);

  // const generatedText = `Once upon a time, in a remote village nestled among misty mountains, there lived an old monk renowned for his wisdom. One day, a traveler sought his counsel, burdened with worries and seeking enlightenment. The monk, without a word, poured tea into the traveler's cup until it overflowed. Bewildered, the traveler exclaimed, "It's full! Stop!" The monk smiled gently, "Your mind is like this cup, overflowing with thoughts. Empty it, and you will find clarity." In that moment, the traveler understood—the path to peace lay not in accumulating, but in letting go. With a lighter heart, the traveler journeyed on.`;
  // let expectedInput = generatedText.split("");
  let userInput = [];
  let savedDuration = Number(localStorage.getItem("duration"));
  let duration = savedDuration || 15;
  let gameTime = duration * 1000;
  let [selectedDuration, setSelectedDuration] = useState(savedDuration || 15);
  window.timer = null;
  window.gameStart = null;

  let totalWords = "";
  let totalWordsArr = [];
  let totalWordsCount = 0;
  let typedWords = "";
  let typedWordCount = 0;
  let slicedTypedWord = [];
  let incorrectWordCount = 0;
  let indices = [];
  let startIndex = 0;

  const [rawwpm, setRawwpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [netwpm, setNetwpm] = useState(0);
  let calcrawwpm = 0;
  let calcaccuracy = 0;
  let calcnetwpm = 0;

  const handleSubmit = () => {
    totalWordsArr = totalWords.trim().split(/\s+/);
    totalWordsCount = totalWordsArr.length;
    for (var i = 0; i < totalWords.length; i++) {
      if (totalWords[i] === " ") indices.push(i);
    }

    for (var j = 0; j < indices.length; j++) {
      let endIndex = indices[j];
      let sliced = typedWords.slice(startIndex, endIndex);
      slicedTypedWord.push(sliced);
      startIndex = endIndex + 1;
    }
    let remainder = typedWords.slice(startIndex);

    slicedTypedWord.push(remainder);

    for (var k = 0; k < totalWordsArr.length; k++) {
      if (totalWordsArr[k] !== slicedTypedWord[k]) {
        incorrectWordCount++;
      }
    }

    // Calculation
    calcrawwpm = totalWordsCount * (60 / duration);
    calcaccuracy = 100 - incorrectWordCount * (100 / totalWordsCount);
    calcnetwpm = calcaccuracy * (calcrawwpm / 100);

    setRawwpm(Math.round(calcrawwpm));
    setAccuracy(Math.round(calcaccuracy));
    setNetwpm(Math.round(calcnetwpm));
  };

  const handleKeyDown = (e) => {
    if (loading) {
      return;
    }

    if (documentFocus === false) {
      documentFocus = true;
      const expectedInputId = document.querySelectorAll(".expectedInput");
      const focusError = document.querySelector(".focusError");
      const cursor = document.querySelector("#cursor");

      if (expectedInputId) {
        expectedInputId.forEach((e) => {
          e.style.filter = "blur(0)";
        });
      }
      if (cursor) {
        cursor.style.filter = "blur(0)";
      }
      if (focusError) {
        focusError.style.opacity = "0";
      }
      return 0;
    }

    const key = e.key;

    if (key.length === 1) {
      userInput.push(key);
    }

    let currentIndex = userInput.length - 1;
    let expectedLetter = expectedInput[currentIndex];
    let userLetter = userInput[currentIndex];

    let currentExpectedClass = `.letter${currentIndex}`;
    let currentLetter = document.querySelector(currentExpectedClass);

    // start timer
    if (!window.timer && currentLetter) {
      const timerBtn = document.querySelectorAll(".timerBtn");
      timerBtn.forEach((e) => {
        e.style.display = "none";
      });

      const countdown = document.querySelector("#countdown");
      countdown.style.display = "block";

      window.gameStart = new Date().getTime();
      window.timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const mPassed = currentTime - window.gameStart;
        const sPassed = Math.round(mPassed / 1000);
        const sLeft = gameTime / 1000 - sPassed;
        document.getElementById("countdown").innerHTML = sLeft + "";

        // Game end
        if (sLeft === 0) {
          handleSubmit();
          const appArea = document.querySelector(".appArea");
          appArea.style.display = "none";

          const resultArea = document.querySelector(".resultArea");
          resultArea.style.display = "flex";

          document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
              window.location.reload();
            }
          });

          clearInterval(window.timer);
          window.timer = null;
        }
      }, 1000);
    }

    console.log("Expected: ", expectedLetter);
    console.log("User: ", userLetter);
    if (key.length === 1 && currentIndex >= 0) {
      if (userLetter === currentLetter.innerHTML && currentLetter) {
        currentLetter.classList.add("correct");
      } else if (userLetter !== currentLetter.innerHTML) {
        if (currentLetter.innerHTML === " ") {
          currentLetter.style.textDecoration = "underline";
        }
        currentLetter.classList.add("incorrect");
      }
      totalWords += currentLetter.innerHTML;
      typedWords += userLetter;
    } else if (key === "Backspace" && currentIndex >= 0) {
      currentLetter.classList.remove("correct");
      currentLetter.classList.remove("incorrect");
      currentLetter.style.textDecoration = "none";
      userInput.pop();
      totalWords = totalWords.substring(0, totalWords.length - 1);
      typedWords = typedWords.substring(0, typedWords.length - 1);
    }

    if (currentLetter) {
      const gameArea = document.querySelector("#gameArea");
      const gameAreaRect = gameArea.getBoundingClientRect();
      const currentLetterRect = currentLetter.getBoundingClientRect();
      const topOffsetFromGameArea = currentLetterRect.top - gameAreaRect.top;
      // move lines
      if (key.length === 1 && currentIndex >= 0 && topOffsetFromGameArea > 50) {
        const expectedInput = document.querySelectorAll(".expectedInput");
        expectedInput.forEach((e) => {
          const top = parseInt(e.style.top || "0px");
          e.style.top = top - 35 + "px";
        });
      }
    }

    // move cursor
    const cursor = document.querySelector("#cursor");
    if (currentLetter) {
      cursor.style.display = "block";
      cursor.style.top = currentLetter.getBoundingClientRect().top + 1 + "px";
      if (key !== "Backspace") {
        cursor.style.left =
          currentLetter.getBoundingClientRect().left + 10 + "px";
      } else {
        cursor.style.left = currentLetter.getBoundingClientRect().left + "px";
      }
    }

    // focus
    const expectedInputId = document.querySelectorAll(".expectedInput");
    const focusError = document.querySelector(".focusError");

    if (expectedInputId) {
      expectedInputId.forEach((e) => {
        e.style.filter = "blur(0)";
      });
    }
    if (cursor) {
      cursor.style.filter = "blur(0)";
    }
    if (focusError) {
      focusError.style.opacity = "0";
    }
  };

  const handleDurationChange = (newDuration) => {
    duration = newDuration;
    setSelectedDuration(newDuration);
    gameTime = newDuration * 1000;
    localStorage.setItem("duration", newDuration);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(
      "blur",
      () => {
        documentFocus = false;
        const expectedInputId = document.querySelectorAll(".expectedInput");
        const focusError = document.querySelector(".focusError");
        const cursor = document.querySelector("#cursor");

        if (expectedInputId) {
          expectedInputId.forEach((e) => {
            e.style.filter = "blur(5px)";
          });
        }
        if (cursor) {
          cursor.style.filter = "blur(5px)";
        }
        if (focusError) {
          focusError.style.opacity = "1";
        }
      },
      [handleKeyDown]
    );

    window.addEventListener("focus", () => {
      documentFocus = true;
      const expectedInputId = document.querySelectorAll(".expectedInput");
      const focusError = document.querySelector(".focusError");
      const cursor = document.querySelector("#cursor");

      if (expectedInputId) {
        expectedInputId.forEach((e) => {
          e.style.filter = "blur(0)";
        });
      }
      if (cursor) {
        cursor.style.filter = "blur(0)";
      }
      if (focusError) {
        focusError.style.opacity = "0";
      }
    });

    moveBubbles();
    const intervalId = setInterval(moveBubbles, 3000);

    return () => clearInterval(intervalId);
  });

  return (
    <div id="mainContainer" tabindex="0">
      <div className="bubble bubbleOne"></div>
      <div className="bubble bubbleTwo"></div>
      <div className="header">
        <img src={logo} alt="logo" />
      </div>
      <div className="resultArea">
        <div>
          <div className="resultBlock">
            <div className="netwpm">
              <p>WPM</p>
              <h1>{netwpm}</h1>
            </div>
            <div className="detailBlock">
              <div className="accuracy">
                <p>ACCURACY</p>
                <h1>{accuracy}%</h1>
              </div>
              <div className="rawwpm">
                <p>RAW WPM</p>
                <h1>{rawwpm}</h1>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="restartBtn"
          >
            <RiRestartLine />
          </button>
          <p className="resetInstruction">reset shortcut - 'Tab'</p>
        </div>
      </div>
      <div className="appArea">
        <div>
          <select className="langDropDown" name="language" id="language">
            <option value="eng">- English -</option>
          </select>
        </div>
        <div className="timer">
          <button
            onClick={() => handleDurationChange(15)}
            className={`timerBtn ${selectedDuration === 15 ? "bold" : ""}`}
          >
            15
          </button>
          <button
            onClick={() => handleDurationChange(30)}
            className={`timerBtn ${selectedDuration === 30 ? "bold" : ""}`}
          >
            30
          </button>
          <button
            onClick={() => handleDurationChange(45)}
            className={`timerBtn ${selectedDuration === 45 ? "bold" : ""}`}
          >
            45
          </button>
          <button
            onClick={() => handleDurationChange(60)}
            className={`timerBtn ${selectedDuration === 60 ? "bold" : ""}`}
          >
            60
          </button>
          <div id="countdown">{selectedDuration}</div>
        </div>
        <div id="gameArea">
          {!generatedText ? (
            <div className="loadingContainer">Loading...</div>
          ) : (
            <>
              <div className="focusError">
                Press a key or click anywhere to focus
              </div>
              {expectedInput.map((letter, index) => (
                <span key={index} className={`expectedInput letter${index}`}>
                  {letter}
                </span>
              ))}
              <div id="cursor"></div>
            </>
          )}
        </div>
      </div>
      <div className="footer">
        <a href="https://erikhein.info" target="_blank" rel="noreferrer">
          created by Erik
        </a>
        <a
          href="https://github.com/erik-ksth/type-in-zen.git"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub className="gitHubIcon" />
        </a>
      </div>
    </div>
  );
}

export default App;
