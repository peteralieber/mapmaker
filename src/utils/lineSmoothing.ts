interface Point {
  x: number
  y: number
}

/**
 * Simplify a path using the Ramer-Douglas-Peucker algorithm
 * Reduces the number of points while preserving the shape
 * @param points - Array of points to simplify
 * @param tolerance - Distance threshold (higher = more simplification)
 * @returns Simplified array of points
 */
export function simplifyPath(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points

  // Find the point with the maximum distance from the line segment
  let maxDistance = 0
  let maxIndex = 0
  const end = points.length - 1

  for (let i = 1; i < end; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[end])
    if (distance > maxDistance) {
      maxDistance = distance
      maxIndex = i
    }
  }

  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const left = simplifyPath(points.slice(0, maxIndex + 1), tolerance)
    const right = simplifyPath(points.slice(maxIndex), tolerance)
    
    // Combine results, removing duplicate point at the join
    return [...left.slice(0, -1), ...right]
  } else {
    // All points between first and last can be removed
    return [points[0], points[end]]
  }
}

/**
 * Calculate perpendicular distance from a point to a line segment
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  
  if (dx === 0 && dy === 0) {
    // Line start and end are the same point
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2)
    )
  }
  
  // Calculate the perpendicular distance
  const numerator = Math.abs(
    dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x
  )
  const denominator = Math.sqrt(dx * dx + dy * dy)
  
  return numerator / denominator
}

/**
 * Smooth a path using Catmull-Rom spline interpolation
 * Creates a smooth curve through the control points
 * @param points - Array of control points
 * @param smoothness - Smoothing factor (0 = no smoothing, 1 = maximum smoothing)
 * @returns SVG path data string with smooth curves
 */
export function smoothPath(points: Point[], smoothness: number): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  // If smoothness is 0, return straight lines
  if (smoothness === 0) {
    return pointsToPathData(points)
  }

  // Use quadratic bezier curves for smoothing
  let pathData = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const next = points[i + 1]
    
    if (i === points.length - 2) {
      // Last segment - line to the end
      pathData += ` L ${next.x} ${next.y}`
    } else {
      // Create a smooth curve using quadratic bezier
      const nextNext = points[i + 2]
      
      // Control point is the current point moved toward the midpoint
      const midX = (next.x + nextNext.x) / 2
      const midY = (next.y + nextNext.y) / 2
      
      // Apply smoothness factor
      const controlX = next.x + (midX - next.x) * smoothness * 0.5
      const controlY = next.y + (midY - next.y) * smoothness * 0.5
      
      pathData += ` Q ${next.x} ${next.y}, ${controlX} ${controlY}`
    }
  }
  
  return pathData
}

/**
 * Alternative smoothing using cubic bezier curves for even smoother results
 */
export function smoothPathCubic(points: Point[], smoothness: number): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  if (smoothness === 0) {
    return pointsToPathData(points)
  }

  let pathData = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1]
    
    // Calculate control points for cubic bezier
    const tension = 0.3 * smoothness
    
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension
    
    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  
  return pathData
}

/**
 * Convert points to simple SVG path data (straight lines)
 */
function pointsToPathData(points: Point[]): string {
  if (points.length === 0) return ''
  const commands = points.map((p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  )
  return commands.join(' ')
}

/**
 * Apply smoothing to a path with both simplification and curve smoothing
 * @param points - Original points from drawing
 * @param smoothness - Smoothing strength (0-1)
 * @returns Processed points and smooth path data
 */
export function applySmoothing(
  points: Point[], 
  smoothness: number
): { simplifiedPoints: Point[], pathData: string } {
  if (points.length <= 2) {
    return {
      simplifiedPoints: points,
      pathData: pointsToPathData(points)
    }
  }

  // Step 1: Simplify the path to reduce points
  // Tolerance increases with smoothness (0.5 to 3.0 pixel tolerance)
  const tolerance = 0.5 + smoothness * 2.5
  const simplifiedPoints = simplifyPath(points, tolerance)
  
  // Step 2: Apply curve smoothing
  const pathData = smoothPathCubic(simplifiedPoints, smoothness)
  
  return { simplifiedPoints, pathData }
}
