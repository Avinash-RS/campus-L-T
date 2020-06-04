@import "../../../themes/themes.scss";

* {
  margin: 0;
  box-sizing: border-box;
}

.top-main-wrapper {
  padding: 4em 4em 1.5em 4em;
  .language-grid {
    margin: 0.25em 0 0 0;
    display: grid;
    grid-template-columns: 60% 40%;
    .form-wrapper-left {
      display: flex;
      flex-direction: column;
      .form-group {
        display: flex;
        align-items: center;
        width: 98%;
        margin: 0.5em 0 0 0;
        label {
          font-size: 16px;
          font-weight: 200;
          color: $light-black;
          margin: 0 0 0.35em 0;
          width: 47%;
          margin: 0 1em 0 0;
        }
        div,
        .input {
          width: 42%;
          height: 40px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          box-shadow: $shadow-light-black;
          border-radius: 5px;
          padding: 0.5em 1em 0.5em 1em;
          display: flex;
          align-items: center;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
          background: $disable-gray;
        }
        .radio-input {
          width: 42%;
          height: 40px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          border-radius: 5px;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
          background: $disable-gray;
        }
      }
    }
    .form-wrapper-right {
      display: flex;
      // flex-direction: column;
      align-items: flex-end;
      position: relative;
      .form-group {
        display: flex;
        align-items: center;
        width: 98%;
        // margin: 1.25em 0 0 0;
        justify-content: space-evenly;
        align-items: center;
        .radio-input {
          height: 40px;
          width: 30px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          border-radius: 5px;
          padding: 0.5em 1em 0.5em 1em;
          display: flex;
          align-items: center;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
        }
        // label {
        //   outline: none;
        //   border: none;
        //   margin: 0 0 0 0;
        //   padding: 0.5em 1em 0.5em 1em;
        //   display: flex;
        //   align-items: center;
        //   font-size: 17px;
        //   overflow: auto;
        //   opacity: 0.87;
        //   color: $light-black;
        //   font-size: 13px;
        // }
      }
    }
  }

  .addressgrid {
    display: flex;
    .form-wrapper-left {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .form-group {
        display: grid;
        grid-template-columns: 30% 70%;
        align-items: center;
        width: 98%;
        margin: 1.25em 0 0 0;
        label {
          // width: 100%;
          font-size: 16px;
          font-weight: 200;
          color: $light-black;
          margin: 0 0 0.35em 0;
          // width: 47%;
          margin: 0 1em 0 0;
        }
        div,
        .input {
          width: 100%;
          min-height: 40px;
          max-height: 400px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          box-shadow: $shadow-light-black;
          border-radius: 5px;
          padding: 0.5em 1em 0.5em 1em;
          display: flex;
          align-items: center;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
          background: $disable-gray;
        }
      }
    }
  }
  .top-grid {
    display: grid;
    grid-template-columns: 60% 40%;
    .form-wrapper {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      .form-group {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 98%;
        margin: 1.25em 0 0 0;
        label {
          // width: 100%;
          font-size: 16px;
          font-weight: 200;
          color: $light-black;
          margin: 0 0 0.35em 0;
          width: 88%;
          margin: 0 1em 0 0;
        }
        div,
        .input {
          width: 95%;
          height: 40px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          box-shadow: $shadow-light-black;
          border-radius: 5px;
          padding: 0.5em 1em 0.5em 1em;
          display: flex;
          align-items: center;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
          background: $disable-gray;
          .label-input {
            outline: none;
            border: none;
            margin: 0 0 0 0;
            height: 15px;
            width: 15px;
            align-items: center;
            font-size: 17px;
            box-shadow: none;
            overflow: auto;
          }
        }
        .dob {
          display: flex;
          justify-content: start;
          align-items: center;
          background: transparent;
          box-shadow: none;
          border: none;
          height: 47px;
          padding: 0px 0 0 0.15em;
          .dob-input {
            text-align: center;
            width: 45px;
            height: 36px;
            margin: 0 1em 0 0em;
            outline: none;
            border: none;
            box-shadow: $shadow-light-black;
            border-radius: 5px;
            font-size: 17px;
            overflow: auto;
            opacity: 1;
            color: $light-black;
            background: $disable-gray;
          }
          .dob-input:last-child {
            background: $white-primary;
            text-align: center;
            width: 75px;
            height: 36px;
            margin: 0 0 0 0em;
            outline: none;
            border: none;
            box-shadow: $shadow-light-black;
            border-radius: 5px;
            font-size: 17px;
            overflow: auto;
            opacity: 1;
            color: $light-black;
            background: $disable-gray;
          }
        }
        .radio {
          border: none;
          padding: 0;
          background: transparent;
          box-shadow: none;
          display: flex;
          height: 41px;
          align-items: center;
        }
      }
    }
    .profile-wrapper {
      grid-row: 1;
      grid-column: 2;
      display: flex;
      justify-content: center;
      .profile {
        margin: 1em 0 0 0;
        box-shadow: $shadow-light-black;
        border-radius: 5px;
        display: flex;
        background: #000;
        width: 180px;
        height: 210px;
        img {
          width: 180px;
          height: 210px;
        }
      }
    }
  }
  .two-grid {
    display: grid;
    grid-template-columns: 60% 40%;
    .form-wrapper-left {
      display: flex;
      flex-direction: column;
      .form-group {
        display: flex;
        // justify-content: space-evenly;
        align-items: center;
        width: 98%;
        margin: 1.25em 0 0 0;
        label {
          // width: 100%;
          font-size: 16px;
          font-weight: 200;
          color: $light-black;
          margin: 0 0 0.35em 0;
          width: 47%;
          margin: 0 1em 0 0;
        }
        div,
        .input {
          width: 42%;
          height: 40px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          box-shadow: $shadow-light-black;
          border-radius: 5px;
          padding: 0.5em 1em 0.5em 1em;
          display: flex;
          align-items: center;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
          background: $disable-gray;
        }
      }
    }
    .form-wrapper-right {
      display: flex;
      flex-direction: column;
      .form-group {
        display: flex;
        align-items: center;
        width: 98%;
        margin: 1.25em 0 0 0;
        label {
          // width: 100%;
          font-size: 16px;
          font-weight: 200;
          color: $light-black;
          margin: 0 0 0.35em 0;
          // width: 88%;
          margin: 0 1em 0 0;
        }
        div,
        .input {
          // width: 95%;
          height: 40px;
          outline: none;
          border: none;
          margin: 0 0 0 0;
          box-shadow: $shadow-light-black;
          border-radius: 5px;
          padding: 0.5em 1em 0.5em 1em;
          display: flex;
          align-items: center;
          font-size: 17px;
          overflow: auto;
          opacity: 1;
          color: $light-black;
          background: $disable-gray;
        }
      }
    }
  }
}

.main-wrapper {
  margin: 0em 0 0 0;
  padding: 0.5em 1em 0em 0.5em;
  .main-heading-bottom {
    color: $light-black;
    font-weight: 600;
    font-size: 17px;
    margin: 1.5em 0 1em 0.75em;
  }
  .flex-wrapper-passport {
    box-shadow: $shadow-light-black;
    background: $white-primary;
    border-radius: 5px;
    padding: 0em 1em 1.5em 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    overflow: auto;
    .edu-wrapper-head {
      display: flex;
      flex-direction: column;
      width: max-content;
      flex-wrap: wrap;
      margin: 1.5em 0 0 2em;
      label {
        font-size: 16px;
        color: $light-black-1;
        margin: 0 0 0.35em 0;
      }
      input {
        border: solid 1px $black-3;
        height: 40px;
        outline: none;
        margin: 0 0 0 0;
        width: 100%;
        box-shadow: $shadow-light-black;
        border-radius: 5px;
        padding: 0.5em 1em 0.5em 1em;
        display: flex;
        align-items: center;
        font-size: 17px;
        overflow: auto;
        opacity: 1;
        color: $light-black;
        background: $disable-gray;
      }
    }
    .height-weight-wrapper {
      display: flex;
      flex-direction: row;
      .sub-edu {
        justify-content: space-between;
        display: flex;
        width: 100%;
      }
    }
    .number,
    .name,
    .profession {
      min-width: 360px;
    }
    .date,
    .valid,
    .place,
    .country {
      width: max-content;
    }
    .physical {
      min-width: 360px;
    }
    .height,
    .weight {
      width: 150px;
      input {
        text-align: center;
      }
    }
    .height {
      width: 150px;
      margin: 0 6em 0 0;
    }
    .power {
      min-width: 360px;
      max-width: 360px;
      .power-wrapper {
        display: inline-flex;
        justify-content: space-between;
        .left-wrapper,
        .right-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          span {
            font-size: 13px;
            color: $primary;
            margin: 0 0.5em 0 0;
            white-space: nowrap;
          }
          input {
            border: solid 1px $black-3;
            text-align: center;
            height: 40px;
            outline: none;
            margin: 0 0 0 0;
            width: 100%;
            box-shadow: $shadow-light-black;
            border-radius: 5px;
            padding: 0.5em 1em 0.5em 1em;
            display: flex;
            align-items: center;
            font-size: 17px;
            overflow: auto;
            opacity: 1;
            color: $light-black;
            background: $disable-gray;
          }
        }
        .right-wrapper {
          margin-left: 1em;
        }
      }
    }
  }
  .grid-wrapper-qualify {
    box-shadow: $shadow-light-black;
    background: $white-primary;
    border-radius: 5px;
    padding: 1.5em 1em 1.5em 0;
    overflow: auto;
    width: 100%;
    .qualify-wrapper-head {
      padding: 0em 0.5em 0em 0;
      display: grid;
      // grid-template-columns: 15% 19% 28% 11% 11% 10% 6%;
      grid-template-columns: 1fr 2fr 1fr 1fr 1fr 0.7fr 0.7fr;
      div {
        font-size: 15px;
        margin: 0 0 0 1em;
        padding: 0 0em;
        min-width: 180px;
        display: flex;
        align-items: center;
        color: $light-black-1;
      }
      .year-head,
      .percentage-head {
        min-width: 110px;
        max-width: 110px;
        width: 110px;
      }
      .board-head {
        min-width: 300px;
      }
    }
    .qualify-wrapper {
      padding: 1em 0.5em 0.5em 0;
      display: grid;
      // white-space: nowrap;
      grid-template-columns: 1fr 2fr 1fr 1fr 1fr 0.7fr 0.7fr;
      // grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      div,
      input {
        border: none;
        height: 36px;
        outline: none;
        margin: 0 0 0 1em;
        box-shadow: $shadow-light-black;
        border-radius: 5px;
        padding: 0.5em 1em 0.5em 1em;
        display: flex;
        align-items: center;
        font-size: 15px;
        // overflow: auto;
        opacity: 1;
        color: $light-black;
        background: $disable-gray;
        min-width: 180px;
      }
      .year,
      .percentage {
        text-align: center !important;
        padding: 0.5em 0.1em 0.5em 0.1em;
        min-width: 110px;
        max-width: 110px;
        width: 110px;
      }
      .board {
        min-width: 300px;
      }
    }
  }
  .main-heading-no-bottom {
    color: $light-black;
    font-weight: 600;
    font-size: 17px;
    margin: 1.5em 0 0em 0.75em;
  }
  .skills-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: auto;
    .skills {
      align-items: center;
      box-shadow: $shadow-light-black;
      text-align: center;
      width: auto;
      margin: 1em 0 0 1.5em;
      display: flex;
      border-radius: 5px;
      padding: 0.5em 1.5em;
      font-size: 17px;
      opacity: 1;
      color: $light-black;
      background: $disable-gray;
    }
  }
  .faculty-wrapper {
    display: flex;
    width: auto;
    justify-content: space-around;
    align-items: center;
    div:first-child {
      min-height: 150px;
      align-items: center;
      box-shadow: $shadow-light-black;
      text-align: left;
      width: 100%;
      display: flex;
      border-radius: 5px;
      justify-content: space-around;
      padding: 1em;
      font-size: 17px;
      opacity: 1;
      color: $light-black;
      background: $disable-gray;
    }
    div:last-child {
      min-height: 150px;
      margin: 0 0 0 2em;
      align-items: center;
      box-shadow: $shadow-light-black;
      text-align: left;
      width: 100%;
      display: flex;
      border-radius: 5px;
      justify-content: space-around;
      padding: 1em;
      font-size: 17px;
      opacity: 1;
      color: $light-black;
      background: $disable-gray;
    }
  }
  .scroll-enable {
    overflow: auto;
    background: $white-primary;
    box-shadow: $shadow-light-black;

    .heading-grid {
      // padding: 0em 0 0.5em 1em;
      display: grid;
      // padding: 0.5em 3em;
      // justify-content: center;
      min-height: 55px;
      align-items: center;
      grid-template-columns: 3fr 2fr 2fr 2fr;
      background: $blue-5 0% 0% no-repeat padding-box;
      // box-shadow: $shadow-light-black;
      text-align: center;
      color: $light-black;
      font-size: 17px;
      font-weight: 200;
      position: relative;
      div {
        min-width: 150px;
        position: relative;
        background: $blue-5 0% 0% no-repeat padding-box;
        align-items: center;
        display: flex;
        justify-content: center;
        min-height: 55px;
        span {
          font-size: 24px;
          top: 0x;
          position: absolute;
          right: 0;
          border-right: solid $blue 1px;
        }
      }
    }
    .head-1 {
      padding-left: 0 !important;
    }

    .form {
      margin: 0em;
      background: $white-primary;
      // box-shadow: $shadow-light-black;
      .text-box-grid {
        display: grid;
        // align-items: center;
        padding: 0 1em 0 2em;
        grid-template-columns: 3fr 2fr 2fr 2fr;
        border-bottom: 0.5px solid #00000029;
        position: relative;
        min-height: 45px;
        opacity: 1;
        color: $light-black;
        background: $disable-gray;
        div {
          min-width: 150px;
          // align-items: center;
          text-align: left;
          width: 100%;
          display: flex;
          justify-content: space-around;
          padding: 0.25em 0.25em;
          font-size: 17px;
        }
      }
    }
  }
}

.submit-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4em 2em 2em 2em;
  button:first-child {
    width: 120px;
    height: 35px;
    background: $light-blue 0% 0% no-repeat padding-box;
    box-shadow: $shadow-light-black-1;
    border-radius: 8px;
    font-weight: 700;
    font-size: 15px;
    color: $white;
    outline: none;
    font-weight: bold;
  }
  button:last-child {
    width: 120px;
    height: 35px;
    margin-left: 30px;
    border-radius: 8px;
    border: 1px solid $blue-1;
    font-weight: 600;
    font-size: 15px;
    color: $blue-1;
    outline: none;
  }
}
.scroll-enable {
  overflow: auto;
  background: $white-primary;
  box-shadow: 0px 0px 5px #00000029;
}

@media only screen and (max-width: 1200px) and (min-width: 200px) {
  .top-main-wrapper {
    padding: 3em 3em 1.5em 3em;
    .addressgrid {
      display: flex;
      .form-wrapper-left {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .form-group {
          display: grid;
          grid-template-columns: 100%;
        }
      }
    }
    .top-grid {
      display: grid;
      grid-template-columns: 100%;
      .form-wrapper {
        grid-column: 0;
        grid-row: 2;
      }
      .profile-wrapper {
        grid-row: 1;
        grid-column: 1;
        justify-content: start;
      }
    }

    // .grid-wrapper-qualify {
    //   .qualify-wrapper-head {
    //     padding: 0em 0.5em 0em 0;
    //     display: grid;
    //     white-space: pre-wrap;
    //     grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    //     div {
    //       white-space: pre-wrap;
    //     }
    //   }
    // }
  }
}
