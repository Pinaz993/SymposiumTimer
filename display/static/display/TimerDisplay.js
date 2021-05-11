// Using EasyTimer, make a timer. This will be the only one we need, as behavior can be changed on the fly.
const timer = new easytimer.Timer();
// Grab the HTML element used to display the timer's current value.
const timerDisplay = document.getElementById("timer-display")
// Tell the timer that when it reaches its target, go overtime at zero seconds.
timer.addEventListener('targetAchieved', e => {go_overtime(0)});

/**
 * A helper function for getting the current UNIX time in seconds.
 * @return {number} the amount of seconds since 1970-01-01T00:00UTC
 */
function now() {
    return Math.round((new Date()).getTime() / 1000);
}

/**
 * The function called in the event that data is received from the server indicating that the timer needs changing.
 * The actual data reception will be implemented elsewhere, to simplify integrating this into the control interface.
 * @param timer_props A dictionary containing the following properties:
 * start_time: number, the Unix time (rounded to seconds) for the timer to have started. Does not have to be now.
 * duration: number, the time in seconds for the time to last
 * paused: bool, whether the timer is paused or not.
 * These parameters are packaged in a dictionary because that's how it was in the old project.
 * TODO: Adapt method to take standard parameters that are easier to document.
 * There's no reason not to unpack the data before now.
 * TODO: Adapt display client application to be able to receive and display labels and arbitrary messages.
 * If you need to tell the speaker something that the audience doesn't need to know, that would be a good way.
 */
function receive_display_input(timer_props){
    //console.log("Display:"); console.log(timer_props);  // Temporary™ Debugging Feature
    // TODO: Rearrange if-else tree to consider most likely scenario first.
    // Is the timer undertime, or overtime?
    if((!timer_props.hasOwnProperty('start_time'))){  // No timer, run the real clock.
        go_real_time();
    } else {
        if (get_time_remaining(timer_props.start_time, timer_props.duration) <= 0) { // Timer is overtime, so go overtime
            timer.removeEventListener('secondsUpdated', updateRealClock);
            timer.addEventListener('secondsUpdated', updateTimer);
            go_overtime(get_seconds_overtime(timer_props.start_time, timer_props.duration));

        } else {  // Timer is not overtime or nonexistent, so go undertime
            timer.removeEventListener('secondsUpdated', updateRealClock);
            timer.addEventListener('secondsUpdated', updateTimer);
            go_undertime(get_time_remaining(timer_props.start_time, timer_props.duration));
        }
        // Is the timer supposed to be paused?
        if(timer_props.paused === false){  // Timer isn't paused, so start the timer. Has no effect if already started and not paused
            timer.start();
            updateTimer();
            // Having accidentally tested, I now know that nonexistent does not === false.
            // I could make the parameter optional, but I think I'll simply make it mandatory in docs.
        } else {  // Timer is paused, so change timer to reflect time at pausing, and pause
            timer.stop();
            timer.start({countdown: true, startValues: {seconds: get_time_remaining(timer_props.start_time, timer_props.duration)}});
            timer.pause();
            updateTimer();
            // We go through all this because we might be loading a new timer, instead of just pausing the existing one.
        }
    }
}

//<editor-fold desc="Timer/Clock Manipulation">
/**
 * Make the timer look like it's overtime and make it count up instead of down, then update the timer.
 * @param {number} seconds: The amount of seconds to put on the timer.
 */
function go_overtime(seconds) {
    // Change the appearance of timerDisplay to indicate that there is no time left.
    timerDisplay.classList.remove('timer-undertime');
    timerDisplay.classList.add('timer-overtime');
    // Stop and restart the clock so that it now counts up from zero.
    timer.stop();
    timer.start({countdown: false, startValues: {seconds: seconds}});
    // Update the timer immediately.
    updateTimer();
}

/**
 * Make the timer look like there's time remaining and make sure it's counting down, then update the timer.
 * @param {number} seconds: How many seconds to count down from.
 */
function go_undertime(seconds) {
    // Change the appearance of timerDisplay to indicate that there is time left.
    timerDisplay.classList.remove('timer-overtime');
    timerDisplay.classList.add('timer-undertime');
    // Stop and restart the clock so that it now counts down from the new start time.
    timer.stop();
    timer.start({countdown: true, startValues: {seconds: seconds}});
    // Update the timer immediately.
    updateTimer();
}

/**
 * Change the timer to a realtime clock, and change 'secondsUpdated' to display such a clock.
 */
function go_real_time() {
    // Change 'secondsUpdated' to reflect the timer's current purpose.
    timer.removeEventListener("secondsUpdated", updateTimer);
    timer.addEventListener("secondsUpdated", updateRealClock);
    // Change the appearance of timerDisplay.
    timerDisplay.classList.remove('timer-overtime');
    timerDisplay.classList.add('timer-undertime');
    // Stop and restart the clock so that it does not keep counting down to its target.
    // Otherwise, the timer will continue to count down, reach zero, and turn red. Not ideal.
    timer.stop();
    timer.start({countdown: false, startValues: {seconds: 0}})
    // Update the timer immediately.
    updateRealClock();
}

/**
 * Returns the amount of time remaining in the timer, given:
 * @param {number} start_time: the Unix time the timer was started, in seconds
 * @param {number} duration: the number of seconds the timer is supposed to last
 * @return {number} The amount of seconds left in the timer.
 */
function get_time_remaining(start_time, duration) {
    return start_time + duration - now();
}

/**
 * Returns the amount of seconds the timer is overtime,
 * or the current time minus the time the timer was supposed to end, given:
 * @param {number} start_time: the Unix time the timer was started, in seconds
 * @param {number} duration: the number of seconds the timer is supposed to last
 * @return {number} the number of seconds since the timer was supposed to end
 * This expression has been simplified algebraically:
 * E = S + D ∧ O = N - E ⇒ O = N - (S + D) ⇒ O = N - S - D where
 * N = the current Unix time, S = the timer's starting time, D = the timer's duration, E = the timer's ending time,
 * O = overtime in seconds
 */
function get_seconds_overtime(start_time, duration) {
    return now() - start_time - duration;
}

/**
 * Changes timerDisplay to display the current time in the local display format. To be used as a callback.
 */
function updateRealClock() {
    timerDisplay.innerHTML = new Date().toLocaleTimeString();
}

/**
 * Changes timerDisplay to display the time values from the Timer. To be used as a callback.
 */
function updateTimer() {
    timerDisplay.innerHTML = timer.getTimeValues().toString();
    // TODO: Change timer such that it only uses as many digits as necessary.
}
//</editor-fold>