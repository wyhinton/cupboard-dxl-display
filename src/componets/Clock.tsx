import React, { useState, useEffect } from "react";

// const Clock = (): JSX.Element => {
//   const currentTime = new Date();

//   return <div>hello</div>;
// };

function Clock(): JSX.Element {
  const [date, setDate] = useState(new Date());
  const clockText = {
    fontSize: "xxx-large",
  };
  //Replaces componentDidMount and componentWillUnmount
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div>
      <div style={clockText}>D.H. HILL</div>
      <div style={clockText}>DATA EXPERIENCE LAB</div>
      <h2>{date.toLocaleTimeString()}.</h2>
    </div>
  );
}

export default Clock;

// import React from "react";
// import "./Clock.css";

// class Clock extends React.Component {
//   getTime() {
//     const currentTime = new Date();
//     return {
//       hours: currentTime.getHours(),
//       minutes: currentTime.getMinutes(),
//       seconds: currentTime.getSeconds(),
//       ampm: currentTime.getHours() >= 12 ? "pm" : "am"
//     };
//   }

//   constructor(props) {
//     super(props);
//     this.state = this.getTime();
//   }

//   componentDidMount() {
//     this.setTimer();
//   }

//   componentWillUnmount(){
//     if(this.timeout){
//       clearTimeout(this.timeout)
//     }
//   }

//   setTimer() {
//     clearTimeout(this.timeout);
//     this.timeout = setTimeout(this.updateClock.bind(this), 1000);
//   }

//   updateClock() {
//     this.setState(this.getTime, this.setTimer);
//   }

//   render() {
//     const { hours, minutes, seconds, ampm } = this.state;
//     return (
//       <div className="clock">
//         {hours === 0 ? 12 : hours > 12 ? hours - 12 : hours}:
//         {minutes > 9 ? minutes : `0${minutes}`}:
//         {seconds > 9 ? seconds : `0${seconds}`} {ampm}
//       </div>
//     );
//   }
// }

// export default Clock;
