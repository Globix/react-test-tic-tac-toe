import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xIsNext: true,
      rows: 4,
    };
    this.state['squares'] = Array(this.state.rows * this.state.rows).fill(null);
    this.newSize = React.createRef();
  }

  handleChange(event) {
    this.setState({newSize: event.target.value});
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(this.state) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? '♪' : '♫';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  renderRows() {
    let rows = [];
    let totalSquares = this.state.rows * this.state.rows - 1;
    for (let i = 0; i < this.state.rows; i++) {
      let column = [];
      for (let j = 0; j < this.state.rows; j++) {
        column.push(this.renderSquare(totalSquares--));
      }
      rows.push(
        <div className="board-row" key={'row' + i}>
          {column}
        </div>
      );
    }
    return rows;
  }

  reset() {
    if (this.newSize.current.value) {
      this.setState({
        rows: this.newSize.current.value
      })
    }
    this.setState({
      xIsNext: true,
      squares: Array(this.state.rows * this.state.rows).fill(null)
    });


  }

  render() {
    const winner = calculateWinner(this.state);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? '♪' : '♫');
    }

    return (
      <div>
        <div>
          <div className="status">{status}</div>
          {this.renderRows()}
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>
            <li key="Reset">
              <button onClick={() => this.reset()}>New Game</button>
            </li>
            <li key="Dimensions">
              <input type="number" ref={this.newSize}/>
              <button onClick={() => this.reset(this.state.newSize)}>Change size</button>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(state) {
  // console.table(state.squares);
  let linesW = [];
  let wCondition = [];
  // Rows win condition
  for (let i = 0; i < state.rows; i++) {
    wCondition = [];
    for (let j = 0; j < state.rows; j++) {
      wCondition.push(j + i * state.rows);
    }
    linesW.push(wCondition);
  }
  // Columns win condition
  for (let i = 0; i < state.rows; i++) {
    wCondition = [];
    for (let j = 0; j < state.rows; j++) {
      wCondition.push(i + j * state.rows);
    }
    linesW.push(wCondition);
  }

  // 1º diagonal win condition
  wCondition = [];
  for (let i = 0; i < state.rows; i++) {
    wCondition.push(i + i * state.rows);
  }
  linesW.push(wCondition);

  // 2º diagonal win condition
  wCondition = [];
  for (let i = 0; i < state.rows; i++) {
    wCondition.push(i * state.rows + state.rows - i - 1);
  }
  linesW.push(wCondition);

  let squareWinCounter;
  for (let t = 0; t < linesW.length; t++) {
    if (state.squares[linesW[t][0]]) {
      squareWinCounter = 0;
      for (let y = 1; y < linesW[t].length; y++) {
        if (state.squares[linesW[t][0]] === state.squares[linesW[t][y]]) {
          squareWinCounter++;
        } else {
          break;
        }
        if (squareWinCounter === state.rows - 1) {
          return state.squares[linesW[t][0]];
        }
      }
    }
  }
  return false;
}
