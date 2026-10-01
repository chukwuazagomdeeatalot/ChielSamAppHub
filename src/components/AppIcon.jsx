export default function AppIcon({ app, size = 'md' }) {
  const { initials, gradient } = app.icon
  const [from, to] = gradient

  return (
    <div
      className={`app-icon app-icon--${size}`}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
      role="img"
      aria-label={app.icon.alt || `${app.name} app icon`}
    >
      {initials}
    </div>
  )
}
