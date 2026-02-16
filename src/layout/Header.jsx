export default function Header() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-end px-6">
      <button
        onClick={() => {
          localStorage.clear()
          location.reload()
        }}
        className="text-sm text-gray-600 hover:text-red-600"
      >
        Çıkış
      </button>
    </header>
  )
}
