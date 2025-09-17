interface ReceiptCardProps {
  id: string
  storeName: string
  totalAmount: number
  date: string
  itemCount: number
  status: 'processed' | 'processing' | 'failed'
  onView?: (id: string) => void
}

const ReceiptCard = ({
  id,
  storeName,
  totalAmount,
  date,
  itemCount,
  status,
  onView
}: ReceiptCardProps) => {
  const statusConfig = {
    processed: {
      color: 'bg-green-100 text-green-800',
      label: 'Processed'
    },
    processing: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Processing'
    },
    failed: {
      color: 'bg-red-100 text-red-800',
      label: 'Failed'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg">🧾</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{storeName}</h3>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>R$ {totalAmount.toFixed(2)}</span>
          <span>•</span>
          <span>{itemCount} items</span>
        </div>
        {onView && (
          <button
            onClick={() => onView(id)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  )
}

export default ReceiptCard