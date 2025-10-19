import { useState } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import PropertiesPanel, { LineProperties } from './components/PropertiesPanel'
import './App.css'

export type DrawingMode = 'path' | 'shape' | 'select'

function App() {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('path')
  const [selectedTool, setSelectedTool] = useState<string>('road')
  const [lineProperties, setLineProperties] = useState<LineProperties>({
    thickness: 3,
    dashStyle: 'solid',
    color: '#404040',
    lineStyle: 'single'
  })

  return (
    <div className="app">
      <Toolbar 
        drawingMode={drawingMode}
        selectedTool={selectedTool}
        onModeChange={setDrawingMode}
        onToolChange={setSelectedTool}
      />
      <Canvas 
        drawingMode={drawingMode}
        selectedTool={selectedTool}
        lineProperties={lineProperties}
      />
      <PropertiesPanel 
        properties={lineProperties}
        onPropertiesChange={setLineProperties}
      />
    </div>
  )
}

export default App
