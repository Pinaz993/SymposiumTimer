const timer = new easytimer.Timer();
const timerDisplay = document.getElementById("timer-display")
timer.addEventListener('targetAchieved', function(e){go_overtime_at_zero()});

function now() {
    return Math.round((new Date()).getTime() / 1000);
}

function receive_display_input(action){
    //console.log("Display:"); console.log(action);  // Temporary™ Debugging Feature
    //TODO: Rearrange if-else tree to consider most likely scenario first
    if((!action.hasOwnProperty('start_time'))){  // No timer, run the real clock.
        timer.removeEventListener("secondsUpdated", updateTimer);
        timer.addEventListener("secondsUpdated", updateRealClock);
        go_real_time();
    } else {
        if (is_timer_overtime(get_time_remaining(action.start_time, action.duration))) {  // Timer is overtime,so go overtime
            timer.removeEventListener('secondsUpdated', updateRealClock);
            timer.addEventListener('secondsUpdated', updateTimer);

            go_overtime(get_seconds_overtime(action.start_time, action.duration));
        } else {  // Timer is not overtime or nonexistent, so go undertime
            timer.removeEventListener('secondsUpdated', updateRealClock);
            timer.addEventListener('secondsUpdated', updateTimer);
            go_undertime(get_time_remaining(action.start_time, action.duration));
        }
        if(action.paused === false){  // Timer isn't paused, so start the timer. Has no effect if already started and not paused
            timer.start();
            updateTimer();
        } else {  // Timer is paused, so change timer to reflect time at pausing, and pause
            timer.stop();
            timer.start({countdown: true, startValues: {seconds: get_time_remaining(action.start_time, action.duration)}});
            timer.pause();
            updateTimer();
        }
    }
}

//<editor-fold desc="Timer/Clock Manipulation">
function go_overtime(seconds) {
    timerDisplay.classList.remove('timer-undertime');
    timerDisplay.classList.add('timer-overtime');
    timer.stop();
    timer.start({countdown: false, startValues: {seconds: seconds}});
    updateTimer();
}

function go_overtime_at_zero() {
    go_overtime(0);
    timer.pause();  // Why this nonsense? Because if I don't do this,
    timer.start();  // the timer stalls whenever the event listener is called.
    updateTimer();  // Don't ask me why.
}

function go_undertime(seconds) {
    timerDisplay.classList.remove('timer-overtime');
    timerDisplay.classList.add('timer-undertime');
    timer.stop();
    timer.start({countdown: true, startValues: {seconds: seconds}});
    updateTimer();
}

function go_real_time() {
    timerDisplay.classList.remove('timer-overtime');
    timerDisplay.classList.add('timer-undertime');
    timer.stop();
    timer.reset();
    timer.start();
    updateRealClock();
}

function get_time_remaining(start_time, duration) {
    let end_time = start_time + duration;
    return end_time - now();
}

function get_seconds_overtime(start_time, duration) {
    let end_time = start_time + duration;
    return now() - end_time;
}

function is_timer_overtime(time_remaining){
    let rtn = true;
    if(time_remaining === Math.abs(time_remaining)){rtn = false}
    return rtn;
}

function updateRealClock() {
    timerDisplay.innerHTML = new Date().toLocaleTimeString();

}

function updateTimer() {
    timerDisplay.innerHTML = timer.getTimeValues().toString();
}
//</editor-fold>