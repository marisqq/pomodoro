let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkSession = true;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workInput = document.getElementById('work-time');
const breakInput = document.getElementById('break-time');
const chime = document.getElementById('chime');
const lofiStream = document.getElementById('lofi-stream');

// 🎯 Update Timer Display
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 🎯 Start Timer
function startTimer() {
  if (!isRunning) {
    if (!timeLeft || timeLeft <= 0) {
      timeLeft = (isWorkSession ? parseInt(workInput.value) : parseInt(breakInput.value)) * 60;
    }
    updateDisplay();
    isRunning = true;
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
        setTimeout(() => {
          startTimer();
        }, 3000);
      }
    }, 1000);
  }
}

// 🎯 Pause Timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  stopVideo();
}

// 🎯 Reset Timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  timeLeft = parseInt(workInput.value) * 60;
  updateDisplay();
  stopVideo();
}

// 🎯 Update Work/Break Time live
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

// Set default mode to Light
document.body.classList.add('dark-mode');

// 🎯 Play/Pause YouTube Stream
function playVideo() {
  lofiStream.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
}

function stopVideo() {
  lofiStream.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}

// 🎯 Attach button listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// 🎯 Initialize Timer
updateDisplay();
