// slightly modified from:
// https://dev.to/jerrymcdonald/creating-a-shareable-whiteboard-with-canvas-socket-io-and-react-2en

// Thanks for the awesome tutorial, Jerry!

import React, { useRef, useEffect } from "react";
import axios from "axios";

// import io from 'socket.io-client';
// import "./styles/board.css";

import css from "styled-jsx/css";

const Board = (props) => {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef = props.getClient();

  useEffect(() => {
    // --------------- getContext() method returns a drawing context on the canvas-----

    const canvas = canvasRef.current;
    const test = colorsRef.current;
    const context = canvas.getContext("2d");

    // ----------------------- Colors --------------------------------------------------

    const colors = document.getElementsByClassName("color");
    console.log(colors, "the colors");
    console.log(test);
    // set the current color
    const current = {
      color: "white",
    };

    // helper that will update the current color
    const onColorUpdate = (e) => {
      console.log(e);
      current.color = e.target.classList[2];
    };

    // loop through the color elements and add the click event listeners
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener("click", onColorUpdate, false);
    }
    let drawing = false;

    // ------------------------------- create the drawing ----------------------------

    const drawLine = (x0, y0, x1, y1, color, emit) => {
      //   y0 += canvasRef.current.
      let dy0 = y0;
      let dy1 = y1;
      dy0 -= 200 - window.pageYOffset;
      dy1 -= 200 - window.pageYOffset;
      // x0 += 10;
      // x1 += 10;
      context.beginPath();
      context.moveTo(x0, dy0);
      context.lineTo(x1, dy1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      // console.log(w);
      // console.log(h);
      // console.log(`Sending to: /toBoard/${props.boardID}`);
      socketRef.send(
        `/toBoard/${props.boardID}`,
        {},
        JSON.stringify({
          from: props.username,
          to: props.boardID,
          content: {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color,
          },
        })
      );
    };

    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e) => {
      if (!drawing) {
        return;
      }
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
    };

    // ----------- limit the number of events per second -----------------------

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    // -----------------add event listeners to our canvas ----------------------

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

    // Touch support for mobile devices
    canvas.addEventListener("touchstart", onMouseDown, false);
    canvas.addEventListener("touchend", onMouseUp, false);
    canvas.addEventListener("touchcancel", onMouseUp, false);
    canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

    // -------------- make the canvas fill its parent component -----------------

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize, false);
    onResize();

    // ----------------------- socket.io connection ----------------------------
    const onDrawingEvent = (data) => {
      // console.log(data);
      const w = canvas.width;
      const h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    };

    // socketRef.current = io.connect('/');
    // socketRef.current.on('drawing', onDrawingEvent);
    console.log("setup: " + `/user/${props.username}/board/${props.boardID}`);
    props
      .getClient()
      .subscribe(`/user/public/board/${props.boardID}`, (hook) => {
        // console.log("Receiving from: " + `/toBoard/${props.boardID}`);
        let body = JSON.parse(hook.body);
        if (body.from == props.username) {
          return;
        } else {
          onDrawingEvent(JSON.parse(body.content));
          // axios
          //   .post(
          //     "http://localhost:8080/blackboard/drawing/getDrawing",
          //     [
          //       {
          //         timestamp: body.timestamp,
          //         boardId: props.boardID,
          //       },
          //     ],
          //     {
          //       headers: {
          //         "Blackboard-Token": props.token,
          //       },
          //     }
          //   )
          //   .then((res) => {
          //     // console.log(res);
          //     return res.data.data[body.chatId];
          //   })
          //   .then((res) => {
          //     res.forEach((line) => {
          //       onDrawingEvent(line.content);
          //     });
          //   });
        }
      });
  }, []);

  // ------------- The Canvas and color elements --------------------------

  return (
    <div>
      <div ref={colorsRef} className="colors">
        <div className="color white" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />
      </div>
      <canvas ref={canvasRef} className="whiteboard" />
      <style jsx>{styles}</style>
    </div>
  );
};

export default Board;

const styles = css`
  * {
    box-sizing: border-box;
  }

  .whiteboard {
    /* height: 100%; */
    /* width: 100%; */
    position: absolute;
    left: 0;
    right: 0;
    /* bottom: 300px; */
    top: 200px;
    background-color: #333;
  }

  .colors {
    position: fixed;
  }

  .color {
    display: inline-block;
    height: 48px;
    width: 48px;
  }

  .color.white {
    background-color: white;
  }
  .color.red {
    background-color: red;
  }
  .color.green {
    background-color: green;
  }
  .color.blue {
    background-color: blue;
  }
  .color.yellow {
    background-color: yellow;
  }
`;
