import { useState } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import './App.css'

export type DrawingMode = 'path' | 'shape' | 'select'

function App() {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('path')
  const [selectedTool, setSelectedTool] = useState<string>('road')

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
      />
    </div>
  )
}

export default App
