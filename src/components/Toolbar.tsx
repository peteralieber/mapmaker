import './Toolbar.css'
import { DrawingMode } from '../App'

interface ToolbarProps {
  drawingMode: DrawingMode
  selectedTool: string
  smoothness: number
  onModeChange: (mode: DrawingMode) => void
  onToolChange: (tool: string) => void
  onSmoothnessChange: (smoothness: number) => void
}

const pathTools = [
  { id: 'road', label: 'Road', icon: '🛣️' },
  { id: 'highway', label: 'Highway', icon: '🛤️' },
  { id: 'railroad', label: 'Railroad', icon: '🚂' },
  { id: 'river', label: 'River', icon: '💧' },
  { id: 'trail', label: 'Trail', icon: '🥾' },
  { id: 'subway', label: 'Subway', icon: '🚇' },
  { id: 'bikepath', label: 'Bike Path', icon: '🚴' }
]

const shapeTools = [
  { id: 'park', label: 'Park', icon: '🌳' },
  { id: 'water', label: 'Water Body', icon: '🌊' },
  { id: 'preserve', label: 'Preserve', icon: '🏞️' }
]

function Toolbar({ drawingMode, selectedTool, smoothness, onModeChange, onToolChange, onSmoothnessChange }: ToolbarProps) {
  const currentTools = drawingMode === 'path' ? pathTools : shapeTools

  return (
    <div className="toolbar">
      <div className="toolbar-header">
        <h2>Map Maker</h2>
      </div>

      <div className="mode-selector">
        <button
          className={drawingMode === 'path' ? 'active' : ''}
          onClick={() => onModeChange('path')}
          title="Draw paths (roads, rivers, etc.)"
        >
          📏 Paths
        </button>
        <button
          className={drawingMode === 'shape' ? 'active' : ''}
          onClick={() => onModeChange('shape')}
          title="Draw shapes (parks, water bodies, etc.)"
        >
          ▢ Shapes
        </button>
        <button
          className={drawingMode === 'select' ? 'active' : ''}
          onClick={() => onModeChange('select')}
          title="Select and edit"
        >
          ↖ Select
        </button>
      </div>

      <div className="tools">
        <h3>{drawingMode === 'path' ? 'Path Types' : 'Shape Types'}</h3>
        {currentTools.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>

      {drawingMode === 'path' && (
        <div className="smoothness-control">
          <h3>Line Smoothness</h3>
          <div className="slider-container">
            <label htmlFor="smoothness-slider">
              <span className="slider-label">Smoothing: {Math.round(smoothness * 100)}%</span>
            </label>
            <input
              id="smoothness-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={smoothness}
              onChange={(e) => onSmoothnessChange(parseFloat(e.target.value))}
              className="smoothness-slider"
            />
            <div className="slider-markers">
              <span>Off</span>
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      )}

      <div className="instructions">
        <h3>Instructions</h3>
        {drawingMode === 'path' && (
          <p>Click and drag to draw continuous paths for roads, rivers, trails, etc.</p>
        )}
        {drawingMode === 'shape' && (
          <p>Click and drag to draw rectangular shapes for parks, water bodies, etc.</p>
        )}
        {drawingMode === 'select' && (
          <p>Select mode (not yet implemented)</p>
        )}
      </div>
    </div>
  )
}

export default Toolbar
