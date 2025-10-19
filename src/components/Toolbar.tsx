import './Toolbar.css'
import { DrawingMode } from '../App'

interface ToolbarProps {
  drawingMode: DrawingMode
  selectedTool: string
  onModeChange: (mode: DrawingMode) => void
  onToolChange: (tool: string) => void
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

function Toolbar({ drawingMode, selectedTool, onModeChange, onToolChange }: ToolbarProps) {
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

      <div className="instructions">
        <h3>Instructions</h3>
        {drawingMode === 'path' && (
          <p>Click and drag to draw continuous paths for roads, rivers, trails, etc.</p>
        )}
        {drawingMode === 'shape' && selectedTool === 'preserve' && (
          <p>Click and drag to draw rectangular shapes for preserves.</p>
        )}
        {drawingMode === 'shape' && (selectedTool === 'park' || selectedTool === 'water') && (
          <p>Click to add points. Double-click to complete the polygon.</p>
        )}
        {drawingMode === 'shape' && selectedTool !== 'park' && selectedTool !== 'water' && selectedTool !== 'preserve' && (
          <p>Click and drag to draw rectangular shapes.</p>
        )}
        {drawingMode === 'select' && (
          <p>Select mode (not yet implemented)</p>
        )}
      </div>
    </div>
  )
}

export default Toolbar
