import { useState } from 'react'

async function fetchStockStatus() {
  const res = await fetch('https://rhode-proxy.raheemelassadi1.workers.dev/')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()

  const match = html.match(/id='js-product-data'>([\s\S]*?)<\/script>/)
  if (!match) throw new Error('Could not find product data')

  const productData = JSON.parse(match[1])
  return productData.variants.some(v => v.available === true)
}

export default function App() {
  const [status, setStatus] = useState(null)
  const [checkedAt, setCheckedAt] = useState(null)

  async function handleCheck() {
    setStatus('loading')
    try {
      const available = await fetchStockStatus()
      setStatus(available ? 'in' : 'out')
      setCheckedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#faf8f5]">
      <div className="flex flex-col items-center gap-6 px-6 max-w-sm w-full text-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#9c8476] mb-1">rhode skin</p>
          <h1 className="text-xl font-bold text-[#643a2a]">the summer kit</h1>
          <p className="text-sm text-[#9c8476] mt-1">warm-weather essentials</p>
        </div>

        <button
          onClick={handleCheck}
          disabled={status === 'loading'}
          className="cursor-pointer bg-[#643a2a] text-white px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {status === 'loading' ? 'Checking…' : 'Check stock'}
        </button>

        {status === 'in' && (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-4">
            <p className="font-semibold">🟢 In stock — go get it!</p>
            {checkedAt && <p className="text-xs mt-1 text-green-500">Checked at {checkedAt}</p>}
          </div>
        )}
        {status === 'out' && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-4">
            <p className="font-semibold">🔴 Out of stock</p>
            {checkedAt && <p className="text-xs mt-1 text-red-400">Checked at {checkedAt}</p>}
          </div>
        )}
        {status === 'error' && (
          <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-4">
            <p className="font-semibold">⚠️ Couldn't reach the page</p>
            <p className="text-xs mt-1">Check the console for details</p>
          </div>
        )}
      </div>
    </div>
  )
}