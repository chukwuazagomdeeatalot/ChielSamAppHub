export default function Badge({ tone = 'default', pulse = false, children }) {
  return (
    <span className={`badge badge--${tone}`}>
      <span className={`badge__dot${pulse ? ' badge__dot--pulse' : ''}`} />
      {children}
    </span>
  )
}
