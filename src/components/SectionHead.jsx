import { Link } from 'react-router-dom'
import { IconArrowRight, IconPlus } from './icons'

export default function SectionHead({ eyebrow, title, description, linkTo, linkLabel }) {
  return (
    <div className="section-head">
      <div className="section-head__text">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p className="lead">{description}</p> : null}
      </div>

      {linkTo ? (
        <Link to={linkTo} className="section-head__link">
          {linkLabel || 'View all'}
          <IconArrowRight size={16} />
        </Link>
      ) : null}
    </div>
  )
}

export function PlaceholderCard({ title, description }) {
  return (
    <div className="placeholder-card">
      <span className="placeholder-card__icon">
        <IconPlus size={24} />
      </span>
      <span className="placeholder-card__title">{title}</span>
      <p className="muted" style={{ maxWidth: '32ch' }}>
        {description}
      </p>
    </div>
  )
}
