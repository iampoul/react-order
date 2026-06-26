# @iampoul/react-order

[![CI](https://github.com/iampoul/react-order/actions/workflows/ci.yml/badge.svg)](https://github.com/iampoul/react-order/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@iampoul/react-order.svg)](https://www.npmjs.com/package/@iampoul/react-order)
[![npm downloads](https://img.shields.io/npm/dm/@iampoul/react-order.svg)](https://www.npmjs.com/package/@iampoul/react-order)

A robust, accessible, and opinionated React drag-and-drop ordering component built on `dnd-kit`.

## Features

- 📱 **Responsive**: Works on desktop and mobile.
- ♿️ **Accessible**: Built-in keyboard support and screen reader announcements.
- 🎨 **Customizable**: Full control over the rendering of items and the drag overlay.
- 🔄 **Flexible Layouts**: Supports vertical, horizontal, and grid layouts.
- ⚡️ **Next.js Ready**: Includes `"use client"` directives for App Router compatibility.

## Installation

```bash
npm install @iampoul/react-order @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Usage

```tsx
import { OrderContainer, OrderItem } from "@iampoul/react-order"
import { useState } from "react"

const initialItems = [{ id: "1", text: "Item 1" }, { id: "2", text: "Item 2" }]

function App() {
  const [items, setItems] = useState(initialItems)

  return (
    <OrderContainer 
      initialItems={items} 
      onReorder={setItems}
      axis="vertical"
      renderOverlay={(activeItem) => (
        <div style={{ padding: "16px", background: "white", boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}>
          {activeItem.text}
        </div>
      )}
    >
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <OrderItem key={item.id} item={item}>
            {({ attributes, listeners, setNodeRef, style, isDragging }) => (
              <li
                ref={setNodeRef}
                style={{
                  ...style,
                  padding: "16px",
                  border: "1px solid #ccc",
                  marginBottom: "8px",
                  opacity: isDragging ? 0.5 : 1,
                }}
                {...attributes}
                {...listeners}
              >
                {item.text}
              </li>
            )}
          </OrderItem>
        ))}
      </ul>
    </OrderContainer>
  )
}
```

## Demo

- Local demo app: `npm run demo:dev`
- Production demo build: `npm run demo:build`
- GitHub Pages-ready static files are generated in `demo/dist`.

## API

### `<OrderContainer>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialItems` | `T[]` | | The list of items (must have unique `id`). |
| `children` | `ReactNode` | | The content to render inside the sortable list. |
| `onReorder` | `(items: T[]) => void` | | Callback triggered after a successful reorder. |
| `onDragStart` | `(event: DragStartEvent) => void` | | Callback triggered when dragging starts. |
| `onDragCancel` | `(event: DragCancelEvent) => void` | | Callback triggered when dragging is cancelled. |
| `axis` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Which axis the items should be sorted along. |
| `disabled` | `boolean` | `false` | When true, all drag-and-drop interactions are disabled. |
| `modifiers` | `Modifiers` | | Array of dnd-kit modifiers to alter the drag behavior. |
| `renderOverlay` | `(activeItem: T) => ReactNode` | | Optional render function for the drag overlay. |

### `<OrderItem>`

| Prop | Type | Description |
|------|------|-------------|
| `item` | `T` | The item object. |
| `children` | `RenderProp` | Exposes `attributes`, `listeners`, `setNodeRef`, `style`, and `isDragging`. |

### `useOrder()`

A hook to access the current order state from anywhere inside an `<OrderContainer>`.

```tsx
const { items, disabled, activeId, axis } = useOrder()
```

| Property | Type | Description |
|----------|------|-------------|
| `items` | `T[]` | The current list of items in their sorted order. |
| `disabled` | `boolean` | Whether the drag-and-drop functionality is currently disabled. |
| `activeId` | `string \| null` | The ID of the currently dragged item, or null if nothing is being dragged. |
| `axis` | `"vertical" \| "horizontal" \| "both"` | The axis the items are being sorted along. |

## License

MIT
