# Architecture Overview

## Design Decisions

### Framework Choice: React + TypeScript + Vite

**React**: Chosen for its component-based architecture, which naturally fits the UI structure of a drawing application with toolbars, canvas, and various controls.

**TypeScript**: Provides type safety for complex state management and component props, reducing bugs and improving developer experience.

**Vite**: Modern, fast build tool with excellent TypeScript and React support. Provides instant hot module replacement during development.

### Vector Graphics: SVG

**Why SVG?**
- Native browser support for vector graphics
- Scalable without quality loss
- Easy to manipulate with DOM/React
- Built-in support for paths, shapes, transforms
- Can be exported/serialized easily

**Alternative Considered**: Canvas API
- Pros: Better performance for many elements
- Cons: Harder to manage individual elements, no DOM access
- Decision: SVG is better for the initial version due to easier element manipulation

### Component Structure

```
App (State Container)
├── Toolbar (Left Sidebar)
│   ├── Mode Selector (Paths/Shapes/Select)
│   └── Tool Selector (Context-dependent tools)
└── Canvas (Drawing Area)
    ├── SVG Container
    ├── Completed Paths
    ├── Completed Shapes
    └── Current Drawing (Preview)
```

### State Management

Currently using React's built-in useState for simplicity:
- `drawingMode`: Current mode (path/shape/select)
- `selectedTool`: Current tool (road/river/park/etc)
- `paths`: Array of completed path objects
- `shapes`: Array of completed shape objects
- `currentPath`/`currentShape`: Work-in-progress elements

**Future Enhancement**: Consider using Context API or state management library if complexity grows.

### Drawing Mechanism

**Paths**:
1. MouseDown: Start new path with initial point
2. MouseMove: Add points to current path (creates smooth line)
3. MouseUp: Finalize path, add to paths array

**Shapes** (Currently rectangles):
1. MouseDown: Set starting corner
2. MouseMove: Update opposite corner (live preview)
3. MouseUp: Finalize shape, add to shapes array

### Styling Approach

Each tool has predefined visual properties:
- **Paths**: Color, stroke width, line caps/joins
- **Shapes**: Fill color (with transparency), stroke color

Properties are stored in the component and could be externalized to a configuration file.

## Future Enhancements

### Short Term
1. **Selection Tool**: Implement ability to select and move elements
2. **Delete/Edit**: Remove or modify existing elements
3. **Undo/Redo**: Command pattern for action history
4. **Export**: Save as SVG or PNG

### Medium Term
1. **More Shape Types**: Circles, polygons, free-form shapes
2. **Layers**: Organize elements in layers
3. **Styling Panel**: Customize colors, widths dynamically
4. **Zoom/Pan**: Navigate large maps

### Long Term
1. **Persistence**: Save/load projects (localStorage, backend)
2. **Collaboration**: Real-time multi-user editing
3. **Smart Tools**: Snap to grid, alignment guides
4. **Templates**: Pre-made map components

## File Organization

```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main drawing surface
│   ├── Toolbar.tsx     # Tool selection UI
│   └── *.css          # Component-specific styles
├── types/              # (Future) TypeScript type definitions
├── utils/              # (Future) Helper functions
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Code Conventions

- **Components**: PascalCase (e.g., `Canvas.tsx`)
- **Interfaces**: PascalCase with `interface` keyword
- **Constants**: UPPER_SNAKE_CASE or descriptive objects
- **CSS Classes**: kebab-case (e.g., `.canvas-container`)
- **Event Handlers**: Prefix with `handle` (e.g., `handleMouseDown`)

## Testing Strategy (Future)

1. **Unit Tests**: Component logic (tool selection, state updates)
2. **Integration Tests**: Drawing interactions (mouse events)
3. **E2E Tests**: Complete user workflows
4. **Visual Tests**: Screenshot comparison for rendering

## Performance Considerations

- Current implementation is fine for small maps (< 100 elements)
- For larger maps, consider:
  - Virtualization for off-screen elements
  - Canvas API instead of SVG
  - WebGL for extremely complex drawings
  - Memoization for expensive calculations
