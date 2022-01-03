import * as React from 'react';
import Board from './Board';
import * as util from './util';

type GameState = {
  turn: number,
  cells: number[],
}

const comTurn = (turn: number, cells: number[]) => {
  const empty = util.countEmpty(cells);
  if (empty < 16) {
    util.endSearch(15, -100, 100, turn, 0, cells);
  } else {
    util.firstSearch(9, -100, 100, turn, 0, cells);
  }
};

const nextTurn = (turn: number, cells: number[]): number => {
  const next = util.opponentColor(turn);
  if (!util.canPlay(next, cells)) {
    if (!util.canPlay(turn, cells)) {
      alert("GameEnd");
      return 0;
    } else {
      alert("Pass");
      return nextTurn(next, cells);
    }
  }

  if (next === 2) {
    comTurn(next, cells);
    return nextTurn(next, cells);
  }
  return next;
}

const Game = () => {
  let initCells: number[] = Array(100).fill(0);
  initCells[util.getPos(4, 4)] = 1;
  initCells[util.getPos(5, 5)] = 1;
  initCells[util.getPos(4, 5)] = 2;
  initCells[util.getPos(5, 4)] = 2;

  const [state, setState] = React.useState<GameState>({
    turn: 1,
    cells: initCells,
  });

  const handleOnClick = (i: number) => {
    const nextCells = state.cells.slice();
    if (util.canPlace(i, state.turn, nextCells)) {
      util.flip(i, state.turn, nextCells);
      const next = nextTurn(state.turn, nextCells)
      setState({ turn: next, cells: nextCells });
    }
  }

  return (
    <Board
      cells={state.cells}
      onClick={(i: number) => handleOnClick(i)}
      turn={state.turn}
    />
  );
}

export default Game;
