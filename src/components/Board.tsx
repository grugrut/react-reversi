import Cell from './Cell';
import * as util from './util';

type BoardProps = {
  cells: number[],
  onClick: (i: number) => void,
  turn: number,
};

const Board = (props: BoardProps) => {
  const SIZE = 640;
  const hline = Array.from(Array(8).keys()).map((_, i) => (
    <line
      key={`h-${i}`}
      x1={0}
      y1={80 * (i + 1)}
      x2={640}
      y2={80 * (i + 1)}
      stroke="black"
      strokeWidth="1"
    />
  ));

  const vline = Array.from(Array(8).keys()).map((_, i) => (
    <line
      key={`v-${i}`}
      x1={80 * (i + 1)}
      y1={0}
      x2={80 * (i + 1)}
      y2={640}
      stroke="black"
      strokeWidth="1"
    />
  ));

  const cells = [];
  for (let i = 1; i <= 8; ++i) {
    const row = [];
    for (let j = 1; j <= 8; ++j) {
      row.push(
        <Cell
          key={`Cell-${util.getPos(i, j)}`}
          x={80 * (i - 1) + 40}
          y={80 * (j - 1) + 40}
          r={30}
          color={props.cells[util.getPos(i, j)]}
          onClick={() => props.onClick(util.getPos(i, j))}
          placable={util.canPlace(util.getPos(i, j), props.turn, props.cells)}
        />);
    }
    cells.push(<g key={`row-${i}`}>{row}</g>);
  }
  return (
    <svg className="Board" width={SIZE} height={SIZE}>
      <rect x="0" y="0" width={SIZE} height={SIZE} stroke="black" strokeWidth="1" fill="green" />
      {hline}
      {vline}
      <g>{cells}</g>
    </svg>
  );
}

export default Board;
