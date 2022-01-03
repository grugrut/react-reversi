export const getPos = (i: number, j: number): number => {
  return i * 10 + j;
}

export const countColor = (color: number, cells: number[]): number => {
  let result = 0;
  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (cells[getPos(i, j)] === color) {
        ++result;
      }
    }
  }
  return result;
}

export const countEmpty = (cells: number[]): number => {
  return 64 - (countColor(1, cells) + countColor(2, cells));
}

export const opponentColor = (color: number): number => {
  if (color === 1) {
    return 2;
  }
  return 1;
}

const canFlipLine = (pos: number, color: number, cells: number[], dir: number): boolean => {
  const op = opponentColor(color);
  let p: number;
  let result = 0;
  for (p = pos + dir; cells[p] === op; p += dir) {
    ++result;
  }
  if (cells[p] !== color) {
    return false;
  }

  if (result > 0) {
    return true;
  }
  return false;
}

export const canPlace = (pos: number, color: number, cells: number[]): boolean => {
  if (cells[pos] !== 0) return false;

  if (canFlipLine(pos, color, cells, -1)) return true;
  if (canFlipLine(pos, color, cells, -11)) return true;
  if (canFlipLine(pos, color, cells, -10)) return true;
  if (canFlipLine(pos, color, cells, -9)) return true;
  if (canFlipLine(pos, color, cells, 1)) return true;
  if (canFlipLine(pos, color, cells, 11)) return true;
  if (canFlipLine(pos, color, cells, 10)) return true;
  if (canFlipLine(pos, color, cells, 9)) return true;

  return false;
}

export const canPlay = (color: number, cells: number[]): boolean => {
  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (canPlace(i * 10 + j, color, cells)) {
        return true;
      }
    }
  }
  return false;
}

const flipLine = (pos: number, color: number, cells: number[], dir: number): void => {
  const op = opponentColor(color);
  let p: number;
  for (p = pos + dir; cells[p] === op; p += dir);
  if (cells[p] !== color) {
    return;
  }
  for (p -= dir; cells[p] === op; p -= dir) {
    cells[p] = color;
  }
}

export const flip = (pos: number, color: number, cells: number[]): void => {
  flipLine(pos, color, cells, -1);
  flipLine(pos, color, cells, -11);
  flipLine(pos, color, cells, -10);
  flipLine(pos, color, cells, -9);
  flipLine(pos, color, cells, 1);
  flipLine(pos, color, cells, 11);
  flipLine(pos, color, cells, 10);
  flipLine(pos, color, cells, 9);
  cells[pos] = color;
}

export const endSearch = (depth: number, alpha: number, beta: number, color: number, pass: number, cells: number[]) => {
  let max_i = 0, max_j = 0, max = -100;
  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (canPlace(getPos(i, j), color, cells)) {
        const newCells = cells.slice();
        flip(getPos(i, j), color, newCells);
        const val = -endSearchSub(depth - 1, -beta, -alpha, opponentColor(color), pass, newCells);
        if (val > max) {
          max = val;
          max_i = i;
          max_j = j;
        }
      }
    }
  }
  flip(getPos(max_i, max_j), color, cells);
  console.log(max_i + ", " + max_j + "=>" + max);
}

const endSearchSub = (depth: number, alpha: number, beta: number, color: number, pass: number, cells: number[]): number => {
  let canMove = false;
  let val: number;
  let max = alpha;
  if (depth === 0) {
    return countColor(color, cells) - countColor(opponentColor(color), cells);
  }
  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (canPlace(getPos(i, j), color, cells)) {
        const newCells = cells.slice()
        flip(getPos(i, j), color, newCells);
        if (!canMove) {
          canMove = true;
        }
        val = -endSearchSub(depth - 1, -beta, -max, opponentColor(color), 0, newCells);
        if (val > max) {
          max = val;
          if (max >= beta) {
            return beta;
          }
        }
      }
    }
  }
  if (!canMove) {
    if (pass) {
      max = countColor(color, cells) - countColor(opponentColor(color), cells);
    } else {
      max = -endSearchSub(depth, -beta, -max, opponentColor(color), 1, cells.slice());
    }
  }
  
  return max;
}

export const firstSearch = (depth: number, alpha: number, beta: number, color: number, pass: number, cells: number[]) => {
  let max_i = 0, max_j = 0, max = -100;
  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (canPlace(getPos(i, j), color, cells)) {
        const newCells = cells.slice();
        flip(getPos(i, j), color, newCells);
        const val = -firstSearchSub(depth - 1, -beta, -alpha, opponentColor(color), pass, newCells);
        if (val > max) {
          max = val;
          max_i = i;
          max_j = j;
        }
      }
    }
  }
  flip(getPos(max_i, max_j), color, cells);
  console.log(max_i + ", " + max_j + "=>" + max);
}

const firstSearchSub = (depth: number, alpha: number, beta: number, color: number, pass: number, cells: number[]): number => {
  let canMove = false;
  let val: number;
  let max = alpha;
  if (depth === 0) {
    return evaluate(color, cells);
  }
  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (canPlace(getPos(i, j), color, cells)) {
        const newCells = cells.slice()
        flip(getPos(i, j), color, newCells);
        if (!canMove) {
          canMove = true;
        }
        val = -firstSearchSub(depth - 1, -beta, -max, opponentColor(color), 0, newCells);
        if (val > max) {
          max = val;
          if (max >= beta) {
            return beta;
          }
        }
      }
    }
  }
  if (!canMove) {
    if (pass) {
      max = evaluate(color, cells);
    } else {
      max = -firstSearchSub(depth, -beta, -max, opponentColor(color), 1, cells.slice());
    }
  }
  
  return max;
}

const evaluate = (color: number, cells: number[]): number => {
  let result = 0;
  let canMe = 0;
  let canOp = 0;

  for (let i = 1; i <= 8; ++i) {
    for (let j = 1; j <= 8; ++j) {
      if (canPlace(getPos(i, j), color, cells)) {
        ++canMe;
      }
      if (canPlace(getPos(i, j), opponentColor(color), cells)) {
        ++canOp;
      }
    }
  }
  result = canMe - canOp;
  return result;
}
