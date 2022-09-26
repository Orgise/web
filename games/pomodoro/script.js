function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}let timer;
class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "state",



    {
      session_length: 25,
      session_state: "started",
      break_length: 5,
      break_state: "finished",
      minutes: 25,
      seconds: 0,
      title: "Session",
      isStarted: false });_defineProperty(this, "incrementSession",


    () => {
      if (!this.state.isStarted) {
        if (this.state.session_length < 60) {
          this.setState(prevState => {
            return {
              session_length: prevState.session_length + 1 };

          });
        }
        if (this.state.session_state === "started") {
          this.setState(prevState => {
            return {
              minutes: prevState.session_length,
              seconds: 0 };

          });
        }
      }
    });_defineProperty(this, "decrementSession",

    () => {
      if (!this.state.isStarted) {
        if (this.state.session_length > 1) {
          this.setState(prevState => {
            return {
              session_length: prevState.session_length - 1 };

          });
        }
        if (this.state.session_state === "started") {
          this.setState(prevState => {
            return {
              minutes: prevState.session_length,
              seconds: 0 };

          });
        }
      }
    });_defineProperty(this, "incrementBreak",

    () => {
      if (!this.state.isStarted) {
        if (this.state.break_length < 60) {
          this.setState(prevState => {
            return {
              break_length: prevState.break_length + 1 };

          });
          let { session_length } = this.state;
          if (session_length === 0) {
            this.setState(prevState => {
              return {
                break_length: prevState.break_length + 1 };

            });
          }
        }
        if (this.state.break_state === "started") {
          this.setState(prevState => {
            return {
              minutes: prevState.break_length,
              seconds: 0 };

          });
        }
      }
    });_defineProperty(this, "decrementBreak",

    () => {
      if (!this.state.isStarted) {
        if (this.state.break_length > 1) {
          this.setState(prevState => {
            return {
              break_length: prevState.break_length - 1 };

          });
          let { session_length } = this.state;
          if (session_length === 0) {
            this.setState(prevState => {
              return {
                break_length: prevState.break_length - 1 };

            });
          }
        }
        if (this.state.break_state === "started") {
          this.setState(prevState => {
            return {
              minutes: prevState.break_length,
              seconds: 0 };

          });
        }
      }
    });_defineProperty(this, "play_stop_Time",

    () => {
      if (!this.state.isStarted) {
        timer = setInterval(this.countDown, 1000);
        this.setState({
          isStarted: true });

      } else {
        clearInterval(timer);
        this.setState({
          isStarted: false });

      }
    });_defineProperty(this, "pauseTime",

    () => {
      clearInterval(timer);
      this.setState({
        isStarted: false,
        isPaused: true });

    });_defineProperty(this, "resetTime",
    () => {
      clearInterval(timer);
      this.setState({
        session_length: 25,
        session_state: "started",
        break_length: 5,
        break_state: "finished",
        minutes: 25,
        seconds: 0,
        title: "Session",
        isStarted: false });

      this.audio_beep.current.pause();
      this.audio_beep.current.currentTime = 0;
    });_defineProperty(this, "countDown",
    () => {
      let { session_state, break_state } = this.state;
      if (session_state === "started") {
        this.sessionCountDown();
      } else if (break_state === "started") {
        this.breakCountDown();
      }
    });_defineProperty(this, "sessionCountDown",

    () => {
      let { seconds, minutes } = this.state;
      if (minutes > 0) {
        if (seconds === 0) {
          minutes--;
          this.setState({
            seconds: 59,
            minutes });

        } else {
          seconds--;
          this.setState({
            seconds });

        }
      } else if (minutes === 0 && seconds > 0) {
        seconds--;
        this.setState({
          seconds });

      } else if (minutes === 0 && seconds === 0) {
        this.setState({
          session_state: "finished",
          break_state: "started",
          title: "Break",
          minutes: this.state.break_length,
          seconds: 0 });

      }
    });_defineProperty(this, "breakCountDown",

    () => {
      let { seconds, minutes } = this.state;
      if (minutes > 0) {
        if (seconds === 0) {
          minutes--;
          this.setState({
            seconds: 59,
            minutes });

        } else {
          seconds--;
          this.setState({
            seconds });

        }
      } else if (minutes === 0 && seconds > 0) {
        seconds--;
        this.setState({
          seconds });

      } else if (minutes === 0 && seconds === 0) {
        this.setState({
          break_state: "finished",
          session_state: "started",
          title: "Session",
          minutes: this.state.session_length,
          seconds: 0 });

      }
    });_defineProperty(this, "timeFormat",


    time_unit => {
      if (time_unit >= 0 && time_unit < 10) {
        time_unit = "0" + time_unit;
      }
      return time_unit;
    });this.time_left = React.createRef();this.audio_beep = React.createRef();}

  render() {
    let {
      break_length,
      session_length,
      minutes,
      seconds,
      title,
      isStarted } =
    this.state;

    let time_style = { color: "white" };
    //
    minutes > 0 ?
    time_style.color = "white" :
    time_style.color = "rgb(194, 27, 27)";
    //
    if (minutes === 0 && seconds === 0) this.audio_beep.current.play();
    //
    let button_class = "";
    !isStarted ?
    button_class = "fa fa-play fa-2x" :
    button_class = "fa fa-pause fa-2x";

    //
    return /*#__PURE__*/(
      React.createElement("div", { id: "main-div" }, /*#__PURE__*/
      React.createElement("div", {
        style: { textAlign: "center", marginTop: "10%", fontSize: "xxx-large" } }, "Pomodoro Clock"), /*#__PURE__*/



      React.createElement("div", { id: "length-div" }, /*#__PURE__*/
      React.createElement("div", { id: "break-div" }, /*#__PURE__*/
      React.createElement("div", { id: "break-label" }, "Break Length"), /*#__PURE__*/
      React.createElement("div", { id: "break-controls" }, /*#__PURE__*/
      React.createElement("button", { id: "break-decrement", onClick: this.decrementBreak }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-arrow-down fa-2x" })), /*#__PURE__*/

      React.createElement("div", { id: "break-length" }, break_length), /*#__PURE__*/
      React.createElement("button", { id: "break-increment", onClick: this.incrementBreak }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-arrow-up fa-2x" })))), /*#__PURE__*/



      React.createElement("div", { id: "session-div" }, /*#__PURE__*/
      React.createElement("div", { id: "session-label" }, "Session Length"), /*#__PURE__*/
      React.createElement("div", { id: "session-controls" }, /*#__PURE__*/
      React.createElement("button", { id: "session-decrement", onClick: this.decrementSession }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-arrow-down fa-2x" })), /*#__PURE__*/

      React.createElement("div", { id: "session-length" }, session_length), /*#__PURE__*/
      React.createElement("button", { id: "session-increment", onClick: this.incrementSession }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-arrow-up fa-2x" }))))), /*#__PURE__*/




      React.createElement("div", { id: "session" }, /*#__PURE__*/
      React.createElement("div", { id: "timer-label" }, title), /*#__PURE__*/
      React.createElement("div", { id: "time-left", ref: this.time_left, style: time_style },
      this.timeFormat(minutes), ":", this.timeFormat(seconds))), /*#__PURE__*/


      React.createElement("div", { id: "controls" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.play_stop_Time }, /*#__PURE__*/
      React.createElement("i", { className: button_class })), /*#__PURE__*/




      React.createElement("button", { id: "reset", onClick: this.resetTime }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-refresh fa-2x" }))), /*#__PURE__*/


      React.createElement("audio", { id: "beep", ref: this.audio_beep }, /*#__PURE__*/
      React.createElement("source", {
        src: "beep-7.wav",
        type: "audio/mp3" }))));




  }}


ReactDOM.render( /*#__PURE__*/React.createElement(PomodoroClock, null), document.getElementById("app"));