let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkSession = true;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const chime = document.getElementById('chime');
const lofiStream = document.getElementById('lofi-stream');

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPauseTimer() {
  if (!isRunning) {
    if (!timeLeft || timeLeft <= 0) {
      timeLeft = (isWorkSession ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
    }
    updateDisplay();
    isRunning = true;
    startButton.textContent = 'Pause';
    startButton.style.background = '#FFC107'; // Change to yellow
    startButton.style.color = 'black';
    playVideo();

    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        isRunning = false;
        chime.play();
        stopVideo();

        isWorkSession = !isWorkSession;
        startButton.textContent = 'Start';
        startButton.style.background = '#4CAF50'; // Reset back to green
        startButton.style.color = 'white';
        setTimeout(() => {
          startPauseTimer();
        }, 3000);
      }
    }, 1000);
  } else {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = 'Start';
    startButton.style.background = '#4CAF50'; // Reset back to green
    startButton.style.color = 'white';
    stopVideo();
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  timeLeft = parseInt(workInput.value) * 60;
  updateDisplay();
  startButton.textContent = 'Start';
  startButton.style.background = '#4CAF50'; // Reset back to green
  startButton.style.color = 'white';
  stopVideo();
}

// 🎯 Update live time input
workInput.addEventListener('input', () => {
  if (!isRunning && isWorkSession) {
    timeLeft = parseInt(workInput.value) * 60;
    updateDisplay();
  }
});

breakInput.addEventListener('input', () => {
  if (!isRunning && !isWorkSession) {
    timeLeft = parseInt(breakInput.value) * 60;
    updateDisplay();
  }
});

// 🎯 Dark/Light Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
});

// Set default to dark mode
document.body.classList.add('dark-mode');

// 🎯 Play/Pause YouTube Stream

function playVideo() {
  // First unmute, then play
  lofiStream.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
  setTimeout(() => {
    lofiStream.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  }, 100);
}


function stopVideo() {
  lofiStream.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}

// 🎯 Attach button listeners
startButton.addEventListener('click', startPauseTimer);
resetButton.addEventListener('click', resetTimer);

// 🎯 Initialize Timer
updateDisplay();
