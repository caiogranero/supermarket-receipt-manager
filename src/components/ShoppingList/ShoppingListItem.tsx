interface ShoppingListItemProps {
  id: string
  name: string
  category: string
  confidence: 'High' | 'Medium' | 'Low'
  lastPurchased: string
  onAdd?: (id: string) => void
  onRemove?: (id: string) => void
}

const ShoppingListItem = ({
  id,
  name,
  category,
  confidence,
  lastPurchased,
  onAdd,
  onRemove
}: ShoppingListItemProps) => {
  const confidenceConfig = {
    High: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${confidenceConfig[confidence]}`}>
          {confidence}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        {category} • Last bought {lastPurchased}
      </p>
      <div className="flex items-center space-x-2">
        {onAdd && (
          <button
            onClick={() => onAdd(id)}
            className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-100 transition-colors"
          >
            Add to List
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default ShoppingListItem