export function Button({ children, ...props }) {
  return <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded" {...props}>{children}</button>;
}
