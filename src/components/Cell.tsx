type CellProps = {
  x: number,
  y: number,
  r: number,
  color: number,
  onClick: () => void,
  placable: boolean,
};

const Cell = (props: CellProps) => {
  let col = 'none';

  if (props.color === 1) {
    col = 'black';
  } else if (props.color === 2) {
    col = 'white';
  }

  return (
    <g className="cell" onClick={props.onClick}>
      <circle
        className="stone"
        fill={col}
        cx={props.x}
        cy={props.y}
        r={props.r}
      />
      {props.placable && (
        <circle
          className="placable"
          fill="gray"
          cx={props.x}
          cy={props.y}
          r={4}
        />
      )}
      <rect className="cell-rect" x={props.x - 40} y={props.y - 40} width={80} height={80} fill='white' />
    </g>
  );
}

export default Cell;
