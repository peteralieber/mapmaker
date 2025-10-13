import { useRef, useState, useEffect, MouseEvent } from 'react'
import './Canvas.css'
import { DrawingMode } from '../App'

interface CanvasProps {
  drawingMode: DrawingMode
  selectedTool: string
}

interface Point {
  x: number
  y: number
}

interface Path {
  id: string
  points: Point[]
  type: string
  color: string
  width: number
}

interface Shape {
  id: string
  points: Point[]
  type: string
  color: string
  fill: string
}

function Canvas({ drawingMode, selectedTool }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [paths, setPaths] = useState<Path[]>([])
  const [shapes, setShapes] = useState<Shape[]>([])
  const [currentPath, setCurrentPath] = useState<Point[]>([])
  const [currentShape, setCurrentShape] = useState<Point[]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    // Reset current drawing when mode changes
    setCurrentPath([])
    setCurrentShape([])
    setIsDrawing(false)
  }, [drawingMode, selectedTool])

  const getMousePosition = (e: MouseEvent<SVGSVGElement>): Point => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }

    const rect = svg.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (drawingMode === 'select') return

    const point = getMousePosition(e)
    setIsDrawing(true)

    if (drawingMode === 'path') {
      setCurrentPath([point])
    } else if (drawingMode === 'shape') {
      setCurrentShape([point])
    }
  }

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return

    const point = getMousePosition(e)

    if (drawingMode === 'path') {
      setCurrentPath(prev => [...prev, point])
    } else if (drawingMode === 'shape') {
      setCurrentShape(prev => {
        if (prev.length === 0) return [point]
        return [prev[0], point]
      })
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing) return

    if (drawingMode === 'path' && currentPath.length > 1) {
      const newPath: Path = {
        id: `path-${Date.now()}`,
        points: currentPath,
        type: selectedTool,
        color: getPathColor(selectedTool),
        width: getPathWidth(selectedTool)
      }
      setPaths(prev => [...prev, newPath])
      setCurrentPath([])
    } else if (drawingMode === 'shape' && currentShape.length === 2) {
      const newShape: Shape = {
        id: `shape-${Date.now()}`,
        points: currentShape,
        type: selectedTool,
        color: getShapeColor(selectedTool),
        fill: getShapeFill(selectedTool)
      }
      setShapes(prev => [...prev, newShape])
      setCurrentShape([])
    }

    setIsDrawing(false)
  }

  const getPathColor = (tool: string): string => {
    const colors: Record<string, string> = {
      road: '#404040',
      highway: '#e67e22',
      railroad: '#2c3e50',
      river: '#3498db',
      trail: '#8b4513',
      subway: '#e74c3c',
      bikepath: '#27ae60'
    }
    return colors[tool] || '#000000'
  }

  const getPathWidth = (tool: string): number => {
    const widths: Record<string, number> = {
      road: 3,
      highway: 5,
      railroad: 2,
      river: 4,
      trail: 2,
      subway: 3,
      bikepath: 2
    }
    return widths[tool] || 2
  }

  const getShapeColor = (tool: string): string => {
    const colors: Record<string, string> = {
      park: '#27ae60',
      water: '#3498db',
      preserve: '#229954'
    }
    return colors[tool] || '#95a5a6'
  }

  const getShapeFill = (tool: string): string => {
    const fills: Record<string, string> = {
      park: 'rgba(39, 174, 96, 0.3)',
      water: 'rgba(52, 152, 219, 0.3)',
      preserve: 'rgba(34, 153, 84, 0.3)'
    }
    return fills[tool] || 'rgba(149, 165, 166, 0.3)'
  }

  const pointsToPathData = (points: Point[]): string => {
    if (points.length === 0) return ''
    const commands = points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    )
    return commands.join(' ')
  }

  const pointsToRectangle = (points: Point[]) => {
    if (points.length < 2) return null
    const [p1, p2] = points
    return {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
      width: Math.abs(p2.x - p1.x),
      height: Math.abs(p2.y - p1.y)
    }
  }

  return (
    <div className="canvas-container">
      <svg
        ref={svgRef}
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render completed paths */}
        {paths.map(path => (
          <path
            key={path.id}
            d={pointsToPathData(path.points)}
            stroke={path.color}
            strokeWidth={path.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Render completed shapes */}
        {shapes.map(shape => {
          const rect = pointsToRectangle(shape.points)
          if (!rect) return null
          return (
            <rect
              key={shape.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke={shape.color}
              strokeWidth={2}
              fill={shape.fill}
            />
          )
        })}

        {/* Render current path being drawn */}
        {drawingMode === 'path' && currentPath.length > 0 && (
          <path
            d={pointsToPathData(currentPath)}
            stroke={getPathColor(selectedTool)}
            strokeWidth={getPathWidth(selectedTool)}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
          />
        )}

        {/* Render current shape being drawn */}
        {drawingMode === 'shape' && currentShape.length === 2 && (() => {
          const rect = pointsToRectangle(currentShape)
          if (!rect) return null
          return (
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke={getShapeColor(selectedTool)}
              strokeWidth={2}
              fill={getShapeFill(selectedTool)}
              opacity={0.7}
            />
          )
        })()}
      </svg>
    </div>
  )
}

export default Canvas
