import css from "styled-jsx/css";

export default css`
  .container {
    flex-direction: column;
    align-items: center;
    align-content: center;
  }

  .inputContainer,
  .doneButton {
    width: 80%;
    flex-direction: row;
    /* justify-content: flex-end; */
    margin: 10px auto;
    /* background-color: green; */
    text-align: right;
  }

  .doneButton {
    text-align: center !important;
  }

  .label {
    /* width: 50%; */
  }

  .input {
    align-self: flex-end;
    /* float: right; */
    /* justify-content: right; */
    /* width: 50%; */
  }

  .error {
    color: red;
  }
`;
