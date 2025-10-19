import { useState } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import './App.css'

export type DrawingMode = 'path' | 'shape' | 'select'

function App() {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('path')
  const [selectedTool, setSelectedTool] = useState<string>('road')
  const [smoothness, setSmoothness] = useState<number>(0.5)

  return (
    <div className="app">
      <Toolbar 
        drawingMode={drawingMode}
        selectedTool={selectedTool}
        smoothness={smoothness}
        onModeChange={setDrawingMode}
        onToolChange={setSelectedTool}
        onSmoothnessChange={setSmoothness}
      />
      <Canvas 
        drawingMode={drawingMode}
        selectedTool={selectedTool}
        smoothness={smoothness}
      />
    </div>
  )
}

export default App
