import { Link } from 'react-router-dom'
import AppIcon from './AppIcon'
import Badge from './Badge'
import { getDisplayVersion, getPlatformLabel, getStatusTone, isReleased } from '../data/apps'
import { IconChevronRight, IconClock, IconSmartphone, IconTag } from './icons'

export default function AppCard({ app }) {
  const released = isReleased(app)

  return (
    <article className="app-card">
      <div className="app-card__top">
        <AppIcon app={app} size="sm" />
        <div className="app-card__ident">
          <span className="app-card__name">{app.name}</span>
          <span className="app-card__category">{app.category}</span>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          <Badge tone={getStatusTone(app.status)}>{app.status}</Badge>
        </span>
      </div>

      <p className="app-card__desc">{app.shortDescription}</p>

      <div className="app-card__meta">
        <span>
          <IconTag size={14} /> {app.category}
        </span>
        <span>
          <IconSmartphone size={14} /> {app.platform}
        </span>
        <span>{getDisplayVersion(app)}</span>
        <span>
          <IconClock size={14} /> {released ? `Updated ${app.updatedAt}` : 'Not released'}
        </span>
      </div>

      <div className="app-card__footer">
        <span className="app-card__size">
          {app.download.sizeMb ? `Size: ${app.download.sizeMb} MB` : `Platform: ${getPlatformLabel(app)}`}
        </span>
        <Link to={`/apps/${app.slug}`} className="btn btn--secondary btn--sm">
          View Details
          <IconChevronRight size={15} />
        </Link>
      </div>
    </article>
  )
}
