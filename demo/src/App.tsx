import { useState } from "react"
import { OrderContainer, OrderItem } from "@iampoul/react-order"
import { horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable"
import "./index.css"

const initialItems = [
  { id: "1", text: "1" },
  { id: "2", text: "2" },
  { id: "3", text: "3" },
]

function SortableList({ items, strategy, direction }: { items: typeof initialItems, strategy: any, direction: 'vertical' | 'horizontal' }) {
  const [list, setList] = useState(items)

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3>{direction === 'vertical' ? 'Vertical' : 'Horizontal'} Layout</h3>
      <OrderContainer initialItems={list} onReorder={setList} strategy={strategy}>
        <div style={{ display: 'flex', flexDirection: direction === 'vertical' ? 'column' : 'row', gap: '8px' }}>
          {list.map((item) => (
            <OrderItem key={item.id} item={item}>
              {({ attributes, listeners, setNodeRef, style }) => (
                <div
                  ref={setNodeRef}
                  style={{
                    ...style,
                    padding: "16px",
                    background: "#e0e0e0",
                    border: "1px solid #999",
                    borderRadius: "4px",
                    cursor: "grab",
                    width: direction === 'horizontal' ? '60px' : '200px',
                    textAlign: 'center'
                  }}
                  {...attributes}
                  {...listeners}
                >
                  {item.text}
                </div>
              )}
            </OrderItem>
          ))}
        </div>
      </OrderContainer>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>React Order Demo</h1>
      <SortableList items={initialItems} strategy={verticalListSortingStrategy} direction="vertical" />
      <SortableList items={initialItems} strategy={horizontalListSortingStrategy} direction="horizontal" />
    </div>
  )
}
