const List = ({ children }) => {
  return (
    <ul className="mx-auto divide-y divide-slate-400 bg-gray-50">
      {children}
    </ul>
  )
}

export default List