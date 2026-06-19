# @iampoul/react-order

A robust, accessible, and opinionated React drag-and-drop ordering component built on `dnd-kit`.

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
    <OrderContainer initialItems={items} onReorder={setItems}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <OrderItem key={item.id} item={item}>
            {({ attributes, listeners, setNodeRef, style }) => (
              <li
                ref={setNodeRef}
                style={{
                  ...style,
                  padding: "16px",
                  border: "1px solid #ccc",
                  marginBottom: "8px",
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

## API

### `<OrderContainer>`

| Prop | Type | Description |
|------|------|-------------|
| `initialItems` | `T[]` | The list of items (must have unique `id`). |
| `onReorder` | `(items: T[]) => void` | Callback triggered after reordering. |

### `<OrderItem>`

| Prop | Type | Description |
|------|------|-------------|
| `item` | `T` | The item object. |
| `children` | `RenderProp` | Exposes `attributes`, `listeners`, `setNodeRef`, and `style`. |

## License

MIT
