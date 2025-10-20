import './PropertiesPanel.css'

export interface LineProperties {
  thickness: number
  dashStyle: 'solid' | 'dashed' | 'dotted'
  color: string
  lineStyle: 'single' | 'double' | 'triple'
}

interface PropertiesPanelProps {
  properties: LineProperties
  onPropertiesChange: (properties: LineProperties) => void
}

function PropertiesPanel({ properties, onPropertiesChange }: PropertiesPanelProps) {
  const handleThicknessChange = (value: number) => {
    onPropertiesChange({ ...properties, thickness: value })
  }

  const handleDashStyleChange = (value: 'solid' | 'dashed' | 'dotted') => {
    onPropertiesChange({ ...properties, dashStyle: value })
  }

  const handleColorChange = (value: string) => {
    onPropertiesChange({ ...properties, color: value })
  }

  const handleLineStyleChange = (value: 'single' | 'double' | 'triple') => {
    onPropertiesChange({ ...properties, lineStyle: value })
  }

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <h2>Properties</h2>
      </div>

      <div className="property-section">
        <h3>Line Thickness</h3>
        <div className="property-control">
          <input
            type="range"
            min="1"
            max="20"
            value={properties.thickness}
            onChange={(e) => handleThicknessChange(Number(e.target.value))}
            className="slider"
          />
          <input
            type="number"
            min="1"
            max="20"
            value={properties.thickness}
            onChange={(e) => handleThicknessChange(Number(e.target.value))}
            className="number-input"
          />
        </div>
      </div>

      <div className="property-section">
        <h3>Dash Style</h3>
        <div className="property-buttons">
          <button
            className={properties.dashStyle === 'solid' ? 'active' : ''}
            onClick={() => handleDashStyleChange('solid')}
          >
            <div className="dash-preview solid"></div>
            Solid
          </button>
          <button
            className={properties.dashStyle === 'dashed' ? 'active' : ''}
            onClick={() => handleDashStyleChange('dashed')}
          >
            <div className="dash-preview dashed"></div>
            Dashed
          </button>
          <button
            className={properties.dashStyle === 'dotted' ? 'active' : ''}
            onClick={() => handleDashStyleChange('dotted')}
          >
            <div className="dash-preview dotted"></div>
            Dotted
          </button>
        </div>
      </div>

      <div className="property-section">
        <h3>Color</h3>
        <div className="property-control">
          <input
            type="color"
            value={properties.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="color-picker"
          />
          <input
            type="text"
            value={properties.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="color-text"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="property-section">
        <h3>Line Style</h3>
        <div className="property-buttons">
          <button
            className={properties.lineStyle === 'single' ? 'active' : ''}
            onClick={() => handleLineStyleChange('single')}
          >
            <div className="line-preview single"></div>
            Single
          </button>
          <button
            className={properties.lineStyle === 'double' ? 'active' : ''}
            onClick={() => handleLineStyleChange('double')}
          >
            <div className="line-preview double"></div>
            Double
          </button>
          <button
            className={properties.lineStyle === 'triple' ? 'active' : ''}
            onClick={() => handleLineStyleChange('triple')}
          >
            <div className="line-preview triple"></div>
            Triple
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPanel
