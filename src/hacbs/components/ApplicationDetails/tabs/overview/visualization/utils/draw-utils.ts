import { Point } from '@patternfly/react-topology';
import { DrawDesign, NODE_SEPARATION_HORIZONTAL } from '../const';

type SingleDraw = (p: Point) => string;
<<<<<<< HEAD
type DoubleDraw = (p1: Point, p2: Point, indentedStart?: number) => string;
=======
type DoubleDraw = (p1: Point, p2: Point) => string;
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
type TripleDraw = (p1: Point, p2: Point, p3: Point) => string;
type DetermineDirection = (p1: Point, p2: Point) => boolean;

const join = (...segments: string[]) => segments.filter((seg) => !!seg).join(' ');

const leftRight: DetermineDirection = (p1, p2) => p1.x < p2.x;
const topDown: DetermineDirection = (p1, p2) => p1.y < p2.y;
const bottomUp: DetermineDirection = (p1, p2) => p1.y > p2.y;

const point: SingleDraw = (p) => `${p.x},${p.y}`;
const moveTo: SingleDraw = (p) => `M ${point(p)}`;
const lineTo: SingleDraw = (p) => `L ${point(p)}`;
const quadTo: DoubleDraw = (corner, end) => `Q ${point(corner)} ${point(end)}`;

<<<<<<< HEAD
=======
// TODO: Try to simplify
// x should not be greater than (NODE_SEPARATION_HORIZONTAL / 2)
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
const CURVE_SIZE = { x: 0, y: 0 };
const curve: TripleDraw = (fromPoint, cornerPoint, toPoint) => {
  const topToBottom = topDown(fromPoint, toPoint);
  if (topToBottom) {
    const rightAndDown = leftRight(fromPoint, cornerPoint) && topDown(cornerPoint, toPoint);
    const downAndRight = topDown(fromPoint, cornerPoint) && leftRight(cornerPoint, toPoint);
    if (rightAndDown) {
      return join(
        lineTo(cornerPoint.clone().translate(-CURVE_SIZE.x, 0)),
        quadTo(cornerPoint, cornerPoint.clone().translate(0, CURVE_SIZE.y)),
      );
    }
    if (downAndRight) {
      return join(
        lineTo(cornerPoint.clone().translate(0, -CURVE_SIZE.y)),
        quadTo(cornerPoint, cornerPoint.clone().translate(CURVE_SIZE.x, 0)),
      );
    }
  } else {
    const rightAndUp = leftRight(fromPoint, cornerPoint) && bottomUp(cornerPoint, toPoint);
    const upAndRight = bottomUp(fromPoint, cornerPoint) && leftRight(cornerPoint, toPoint);
    if (rightAndUp) {
      return join(
        lineTo(cornerPoint.clone().translate(-CURVE_SIZE.x, 0)),
        quadTo(cornerPoint, cornerPoint.clone().translate(0, -CURVE_SIZE.y)),
      );
    }
    if (upAndRight) {
      return join(
        lineTo(cornerPoint.clone().translate(0, CURVE_SIZE.y)),
        quadTo(cornerPoint, cornerPoint.clone().translate(CURVE_SIZE.x, 0)),
      );
    }
  }

  return '';
};

export const straightPath: DoubleDraw = (start, finish) => join(moveTo(start), lineTo(finish));

<<<<<<< HEAD
export const integralShapePath: DoubleDraw = (start, finish, startIndentX = 0) => {
=======
export const integralShapePath: DoubleDraw = (start, finish) => {
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
  // Integral shape: ∫
  let firstCurve: string = null;
  let secondCurve: string = null;

  if (start.y !== finish.y) {
<<<<<<< HEAD
    const cornerX = Math.floor(start.x + NODE_SEPARATION_HORIZONTAL / 3);
=======
    const cornerX = Math.floor(start.x + NODE_SEPARATION_HORIZONTAL / 2);
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
    const firstCorner = new Point(cornerX, start.y);
    const secondCorner = new Point(cornerX, finish.y);

    firstCurve = curve(start, firstCorner, secondCorner);
    secondCurve = curve(firstCorner, secondCorner, finish);
  }
<<<<<<< HEAD
  const indentedStart = new Point(start.x - startIndentX, start.y);
  return join(moveTo(indentedStart), firstCurve, secondCurve, lineTo(finish));
=======

  return join(moveTo(start), firstCurve, secondCurve, lineTo(finish));
>>>>>>> b6b3685 (Add HAC build service application workflow visualiation)
};

export const path = (start: Point, finish: Point, drawDesign?: DrawDesign) => {
  switch (drawDesign) {
    case DrawDesign.INTEGRAL_SHAPE:
      return integralShapePath(start, finish);
    case DrawDesign.STRAIGHT:
    default:
      return straightPath(start, finish);
  }
};
