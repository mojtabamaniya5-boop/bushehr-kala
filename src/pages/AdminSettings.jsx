export default function AdminSettings({ settings, setSettings, onSave, saving }) {
  return (
    <div className="p-6 text-center bg-yellow-100 rounded-2xl border-2 border-yellow-400">
      <div className="text-lg font-bold">🔧 TEST AdminSettings</div>
      <div className="text-sm mt-2">
        settings: {settings ? '✅ loaded' : '❌ null'}
      </div>
      {settings && (
        <div className="text-xs mt-2 break-all">
          name: {settings.name}<br/>
          shippingFast: {String(settings.shippingFast)}<br/>
          freePostalPrefixes: {JSON.stringify(settings.freePostalPrefixes)}
        </div>
      )}
    </div>
  )
}
