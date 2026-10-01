export default function AppIcon({ app, size = 'md' }) {
  const [from, to] = app.gradient

  return (
    <div
      className={`app-icon app-icon--${size}`}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
      role="img"
      aria-label={`${app.name} app icon`}
    >
      {app.initials}
    </div>
  )
}
