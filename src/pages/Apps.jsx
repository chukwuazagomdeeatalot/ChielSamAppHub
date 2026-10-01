import { useMemo, useState } from 'react'
import AppCard from '../components/AppCard'
import { PlaceholderCard } from '../components/SectionHead'
import { APP_STATUS, getAllApps, getCategories } from '../data/apps'
import { IconGrid, IconSearch } from '../components/icons'

const STATUS_FILTERS = ['All', APP_STATUS.AVAILABLE, APP_STATUS.COMING_SOON, APP_STATUS.IN_REVIEW]

export default function Apps() {
  const apps = getAllApps()
  const categories = getCategories()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return apps.filter((app) => {
      const matchesCategory = category === 'All' || app.category === category
      const matchesStatus = status === 'All' || app.status === status
      const matchesQuery =
        term === '' ||
        app.name.toLowerCase().includes(term) ||
        app.shortDescription.toLowerCase().includes(term) ||
        app.category.toLowerCase().includes(term)

      return matchesCategory && matchesStatus && matchesQuery
    })
  }, [apps, category, query, status])

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="page-head__row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="eyebrow">Catalogue</span>
              <h1 style={{ fontSize: 'clamp(1.9rem, 1.5rem + 1.6vw, 2.8rem)' }}>All apps</h1>
            </div>
            <span className="muted" style={{ fontWeight: 600 }}>
              {apps.length} app{apps.length === 1 ? '' : 's'} published by ChielSam
            </span>
          </div>
          <p className="lead">
            Every app on the hub, generated from one data source. Open an app to see its features,
            version history, release notes and update state.
          </p>
        </div>

        <div className="filter-bar">
          <div className="search">
            <span className="search__icon">
              <IconSearch size={17} />
            </span>
            <input
              className="search__input"
              type="search"
              placeholder="Search apps by name or category…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search apps"
            />
          </div>

          <div className="chip-group" role="group" aria-label="Filter by category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip${category === item ? ' is-active' : ''}`}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="chip-group" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip chip--status${status === item ? ' is-active' : ''}`}
                onClick={() => setStatus(item)}
                aria-pressed={status === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="result-count">
          Showing {filtered.length} of {apps.length} app{apps.length === 1 ? '' : 's'}
        </p>

        <div className="app-grid">
          {filtered.map((app) => (
            <AppCard app={app} key={app.id} />
          ))}

          {filtered.length === 0 ? (
            <PlaceholderCard
              title="No apps match your search"
              description="Try a different name, or switch the category and status filters back to All."
            />
          ) : null}
        </div>

        <div className="trust-strip" style={{ marginTop: 'var(--space-10)' }}>
          <span>
            <IconGrid size={16} /> New apps appear in this catalogue automatically as soon as they
            are added to the data source
          </span>
        </div>
      </div>
    </div>
  )
}
