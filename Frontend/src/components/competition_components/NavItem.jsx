export default function NavItem({ href, isActive, onClick, children }) {
  return (
    <li>
      <a
        href={href}
        className={`block px-3 py-2 rounded-md ${isActive ? 'font-bold underline decoration-primary' : 'font-normal'}`}
        onClick={onClick}
      >
        {children}
      </a>
    </li>
  )
}