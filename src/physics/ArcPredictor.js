// =========================================================================
// TRAJECTORY ARC PREDICTOR
// =========================================================================
import { CONFIG } from '../config.js';

export class ArcPredictor {
  static getTrajectoryPoints(startX, startY, initVx, initVy, maxSteps = 26) {
    const points = [];
    let x = startX;
    let y = startY;
    let vx = initVx;
    let vy = initVy;

    for (let i = 0; i < maxSteps; i++) {
      vy += CONFIG.GRAVITY;
      x += vx;
      y += vy;
      if (y > CONFIG.FLOOR_Y) break;
      points.push({ x, y, alpha: 1 - (i / maxSteps) });
    }
    return points;
  }
}

