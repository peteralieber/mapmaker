import { useRef, useState, useEffect, MouseEvent } from 'react'
import './Canvas.css'
import { DrawingMode } from '../App'
import { LineProperties } from './PropertiesPanel'

interface CanvasProps {
  drawingMode: DrawingMode
  selectedTool: string
  lineProperties: LineProperties
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
  dashStyle: 'solid' | 'dashed' | 'dotted'
  lineStyle: 'single' | 'double' | 'triple'
}

interface Shape {
  id: string
  points: Point[]
  type: string
  color: string
  fill: string
}

function Canvas({ drawingMode, selectedTool, lineProperties }: CanvasProps) {
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
        color: lineProperties.color,
        width: lineProperties.thickness,
        dashStyle: lineProperties.dashStyle,
        lineStyle: lineProperties.lineStyle
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

  const getDashArray = (dashStyle: 'solid' | 'dashed' | 'dotted', width: number): string => {
    if (dashStyle === 'solid') return 'none'
    if (dashStyle === 'dashed') return `${width * 3} ${width * 2}`
    if (dashStyle === 'dotted') return `${width} ${width}`
    return 'none'
  }

  const renderPath = (path: Path) => {
    const pathData = pointsToPathData(path.points)
    const dashArray = getDashArray(path.dashStyle, path.width)

    if (path.lineStyle === 'single') {
      return (
        <path
          key={path.id}
          d={pathData}
          stroke={path.color}
          strokeWidth={path.width}
          strokeDasharray={dashArray}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )
    } else if (path.lineStyle === 'double') {
      return (
        <g key={path.id}>
          <path
            d={pathData}
            stroke={path.color}
            strokeWidth={path.width * 2}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            stroke="#f5f5f5"
            strokeWidth={path.width * 0.6}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )
    } else if (path.lineStyle === 'triple') {
      return (
        <g key={path.id}>
          <path
            d={pathData}
            stroke={path.color}
            strokeWidth={path.width * 2.5}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            stroke="#f5f5f5"
            strokeWidth={path.width * 1.2}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            stroke={path.color}
            strokeWidth={path.width * 0.4}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )
    }
  }

  const renderCurrentPath = () => {
    if (drawingMode !== 'path' || currentPath.length === 0) return null

    const pathData = pointsToPathData(currentPath)
    const dashArray = getDashArray(lineProperties.dashStyle, lineProperties.thickness)

    if (lineProperties.lineStyle === 'single') {
      return (
        <path
          d={pathData}
          stroke={lineProperties.color}
          strokeWidth={lineProperties.thickness}
          strokeDasharray={dashArray}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
      )
    } else if (lineProperties.lineStyle === 'double') {
      return (
        <g opacity={0.7}>
          <path
            d={pathData}
            stroke={lineProperties.color}
            strokeWidth={lineProperties.thickness * 2}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            stroke="#f5f5f5"
            strokeWidth={lineProperties.thickness * 0.6}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )
    } else if (lineProperties.lineStyle === 'triple') {
      return (
        <g opacity={0.7}>
          <path
            d={pathData}
            stroke={lineProperties.color}
            strokeWidth={lineProperties.thickness * 2.5}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            stroke="#f5f5f5"
            strokeWidth={lineProperties.thickness * 1.2}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            stroke={lineProperties.color}
            strokeWidth={lineProperties.thickness * 0.4}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )
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
        {paths.map(path => renderPath(path))}

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
        {renderCurrentPath()}

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
