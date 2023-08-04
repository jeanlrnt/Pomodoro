let workTime = 1800;
let restTime = 300;

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
        cycles.textContent = 'Cycle(s) :' + cycleCount;
        workTime = 1799;
        restTime = 300;
        displayWork.textContent = formattedTime(workTime);
        displayRest.textContent = formattedTime(restTime);
        handleClassAnimation({work: true, rest: false});
    }
}

function handleClassAnimation(itemState) {
    for(const item in itemState) {
        if (itemState[item]) {
            document.querySelector(`.${item}`).classList.add('active');
        } else {
            document.querySelector(`.${item}`).classList.remove('active');
        }
    }
}

const resetBtn = document.querySelector('.reset-btn');

resetBtn.addEventListener('click', resetPomodoro);

function resetPomodoro() {
    workTime = 1800;
    restTime = 300;
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
