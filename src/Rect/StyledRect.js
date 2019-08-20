import styled from 'styled-components'

export default styled.div`
  position: absolute;
  border: 3px solid #9c27b0;

  .circle {
    position: absolute;
    width: 14px;
    height: 14px;
    background: white;
    border: 1px solid white;
    border-radius: 50%;
    -moz-box-shadow: 0px 0px 5px 1px #ccc;
    -webkit-box-shadow: 0px 0px 5px 1px #ccc;
    box-shadow: 0px 0px 5px 1px #ccc;
    pointer-events: auto;
  }

  .resizable-handler {
    position: absolute;
    width: 14px;
    height: 14px;
    cursor: pointer;
    z-index: 1;
    pointer-events: auto;
  }

  .rotate {
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: -40px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    -moz-box-shadow: 0px 0px 5px 1px #ccc;
    -webkit-box-shadow: 0px 0px 5px 1px #ccc;
    box-shadow: 0px 0px 5px 1px #ccc;
    pointer-events: auto;
  }

  .t,
  .tl,
  .tr {
    top: 0px;
  }

  .b,
  .bl,
  .br {
    bottom: 0px;
  }

  .r,
  .tr,
  .br {
    right: 0px;
  }

  .tl,
  .l,
  .bl {
    left: 0px;
  }

  .l,
  .r {
    top: 50%;
    margin-top: 0px;
  }

  .t,
  .b {
    left: 50%;
    margin-left: 0px;
  }

  .t {
    transform: translate(-50%, -50%);
  }

  .b {
    transform: translate(-50%, 50%);
  }

  .l {
    transform: translate(-50%, -50%);
  }

  .r {
    transform: translate(50%, -50%);
  }

  .tl {
    transform: translate(-50%, -50%);
  }

  .tr {
    transform: translate(50%, -50%);
  }

  .bl {
    transform: translate(-50%, 50%);
  }

  .br {
    transform: translate(50%, 50%);
  }
`
