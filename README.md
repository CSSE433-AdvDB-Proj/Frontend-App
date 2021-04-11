# Setup
- npm install

# Run
- npm run dev

# Socket

- Every page is connected through socket
- Socket will automatically dispatch ALL incoming messages to reducer
- To deal with socket information, write reducers in Redux

# Redux

- Use reducer for any data that comes from somewhere else
- Create reducer like in redux/demoReducer.js
- Import the reducer in redux/index.js
- Connect component to reducer like components/demo/demo.js
  - connect(mapStateToProps, mapDispatchToProps)(Demo)

# CSS

- use this to get CSS  
```js
import css from "styled-jsx/css";
```
- then define css as such:
```js
const styles = css`{
    .container {
        flex-direction: row;
    }
}
`
```
- then inside your JSX, have this:
```html
<div>
    <Component />
    ...
    <styles jsx>{styles}</styles>
<div>
```

# Components
- Make components instead of rewriting code
```js
import React from 'react'

class SomeComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div>Hello World</div>
    }
}
```

- To make an unconnected component, add:
```js
export default SomeComponent
```
- For connected component, add:
```js

import { connect } from "react-redux";

const mapStateToProps = (state, props) => {
  return {
    someState: state.someReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    someDispatch: (content, client) => changeCurNum(content, client)(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
```
- For static component, you want PureComponents, who won't re-render:
```js
class SomeComponent extends React.PureComponent {}
```