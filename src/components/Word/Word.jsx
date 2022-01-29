import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Word.scss';
import wordsArray from './words/words';

const totalTries = 8;

export default function Word() {
  const [answer, setAnswer] = useState(
    wordsArray[Math.floor(Math.random() * wordsArray.length)].toLowerCase(),
  );
  const [input, setInput] = useState('');
  const [words, setWords] = useState([]);
  const [tries, setTries] = useState(totalTries);
  const [points, setPoints] = useState(0);
  const [highscore] = useLocalStorage('points'); // send the key to be tracked.

  const fetchWord = () => {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)].toLowerCase();
  };

  const handleCorrect = () => {
    setTries(5);

    setWords([]);
    setAnswer(fetchWord());
  };

  const handleKeyPress = (event) => {
    if (tries === 0) {
      return null;
    }

    if (event.keyCode === 38) {
      setTries(tries + 1);
    }

    if (event.key === 'Enter') {
      if (event.target.value.length !== answer.length) {
        alert('write more letters');
        return;
      }

      if (event.target.value.toLowerCase() === answer.toLowerCase()) {
        event.preventDefault();
        setWords([...words, input]);
        Swal.fire(`Good job!`, `The correct word was: ${answer}`, 'success').then(() => {
          handleCorrect();
        });
        setPoints(points + 1);

        if (highscore < points) {
          writeStorage('points', points + 1);
        }

        setInput('');
      } else {
        setWords([...words, input]);
        setTries(tries - 1);
        setInput('');
      }
    }
  };

  const renderTries = () => {
    return Array(totalTries)
      .fill(null)
      .map((_, index) => {
        if (words[index]) {
          return (
            <div className="word-container" key={index}>
              {words[index].split('').map((letter, index) => {
                const Correct = letter.toLowerCase() === answer[index].toLowerCase();
                const almostCorrect = !Correct && answer.includes(letter);

                return (
                  <div
                    className={`letter-container ${almostCorrect && 'almost-correct'} ${
                      Correct && 'correct'
                    }`}
                    key={index}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        } else {
          return (
            <div className="word-container" key={index}>
              {answer.split('').map((_, index) => {
                return <div className="letter-container" key={index}></div>;
              })}
            </div>
          );
        }
      });
  };

  return (
    <div className="Word">
      <h1>Guess a champion with {answer.length} letters</h1>
      <div className="tries text">Tries Left: {tries}</div>
      <div className="scores">
        <div className="points text">Current Streak: {points}</div>
        <div className="points text">Highscore: {highscore}</div>
      </div>
      <div className="tries">{renderTries()}</div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        type="text"
        name="name"
        maxLength={answer.length}
        minLength={answer.length}
        placeholder="Type a champion name"
      />
    </div>
  );
}
