import { Position } from 'types/PositionType';

export function calculateDist(p1: Position, p2: Position) {
  return Math.sqrt(
    Math.pow(Math.abs(p1.coordinates[0] - p2.coordinates[0]), 2) +
      Math.pow(Math.abs(p1.coordinates[1] - p2.coordinates[1]), 2),
  );
}
