export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200 ${className}`}
    />
  )
}
