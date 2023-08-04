const workTimeDefault = 1800;
const restTimeDefault = 300;
let workTime = workTimeDefault;
let restTime = restTimeDefault;

function formattedTime(time) {
  return `${Math.trunc(time / 60)}:${time % 60 < 10 ? '0' + time % 60 : time % 60}`;
}

const displayWork = document.querySelector('.work-display-time');
const displayRest = document.querySelector('.rest-display-time');

displayWork.textContent = formattedTime(workTime);
displayRest.textContent = formattedTime(restTime);

const toggleBtn = document.querySelector('.toggle-start-btn');

toggleBtn.addEventListener('click', togglePomodoro);

let currentInterval = false;
let timerId = null;
function togglePomodoro() {
    handlePlayPause();

    if (currentInterval) return;
    currentInterval = true;

    workTime--;
    handleClassAnimation({work: true, rest: false})
    displayWork.textContent = formattedTime(workTime);
    timerId = setInterval(handleTicks, 1000);
}

let pause = true;
function handlePlayPause() {
    if (toggleBtn.getAttribute('data-toggle') === 'play') {
        pause = false;
        toggleBtn.firstElementChild.src = './resources/pause.svg';
        toggleBtn.firstElementChild.alt = 'Rest icon';
        toggleBtn.setAttribute('data-toggle', 'pause');

        if (workTime) {
            handleClassAnimation({work: true, rest: false});
        } else {
            handleClassAnimation({work: false, rest: true});
        }
    } else {
        pause = true;
        toggleBtn.firstElementChild.src = './resources/play.svg';
        toggleBtn.firstElementChild.alt = 'Play icon';
        toggleBtn.setAttribute('data-toggle', 'play');
        handleClassAnimation({work: false, rest: false});
    }
}

const cycles = document.querySelector('.cycles');
let cycleCount = 0;
function handleTicks() {
    if (!pause && workTime > 0) {
        workTime--;
        displayWork.textContent = formattedTime(workTime);
        handleClassAnimation({work: true, rest: false});
    } else if (!pause && !workTime && restTime > 0) {
        restTime--;
        displayRest.textContent = formattedTime(restTime);
        handleClassAnimation({work: false, rest: true});
    } else if (!pause && !workTime && !restTime) {
        cycleCount++;
        cycles.textContent = `Cycles : ${cycleCount}`;
        workTime = workTimeDefault;
        restTime = restTimeDefault;
        displayWork.textContent = formattedTime(workTime);
        displayRest.textContent = formattedTime(restTime);
        handleClassAnimation({work: true, rest: false});
    }
}

function handleClassAnimation({work, rest}) {
    let workDisplay = document.querySelector(`.work`);
    let workProgressBar = workDisplay.parentNode.querySelector('.progress-bar');
    let restDisplay = document.querySelector(`.rest`);
    let restProgressBar = restDisplay.parentNode.querySelector('.progress-bar');
    if (work) {
        document.querySelector('.work').classList.add('active');
        document.querySelector('.rest').classList.remove('active');
        let width = 100 - (workTime / workTimeDefault * 100);
        workProgressBar.style.width = `${width}%`;
        workProgressBar.style.transition = 'width 1s linear';
    } else {
        document.querySelector('.work').classList.remove('active');
        workProgressBar.style.width = '0';
        workProgressBar.style.transition = 'none';
    }
    if (rest) {
        document.querySelector('.rest').classList.add('active');
        document.querySelector('.work').classList.remove('active');
        let width = 100 - (restTime / restTimeDefault * 100);
        restProgressBar.style.width = `${width}%`;
        restProgressBar.style.transition = 'width 1s linear';
    } else {
        document.querySelector('.rest').classList.remove('active');
        restProgressBar.style.width = '0';
        restProgressBar.style.transition = 'none';
    }
}

const resetBtn = document.querySelector('.reset-btn');

resetBtn.addEventListener('click', resetPomodoro);

function resetPomodoro() {
    workTime = workTimeDefault;
    restTime = restTimeDefault;
    displayWork.textContent = formattedTime(workTime);
    displayRest.textContent = formattedTime(restTime);

    cycleCount = 0;
    cycles.textContent = `Cycles : ${cycleCount}`;

    clearInterval(timerId);
    currentInterval = false;
    pause = true;

    toggleBtn.setAttribute('data-toggle', 'play');
    toggleBtn.firstElementChild.src = './resources/play.svg';

    handleClassAnimation({work: false, rest: false});
}
