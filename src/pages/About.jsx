import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import FeatureList from '../components/FeatureList'
import { getAllApps } from '../data/apps'
import { getHubStats } from '../services/releaseService'
import {
  IconArrowRight,
  IconCode,
  IconHeart,
  IconShield,
  IconSparkle,
  IconStore,
  IconSmartphone,
} from '../components/icons'

const VALUES = [
  {
    icon: IconStore,
    title: 'One home per app',
    text: 'Every app ChielSam ships gets its own page with version, status and release notes.',
  },
  {
    icon: IconShield,
    title: 'Single verified owner',
    text: 'Only ChielSam publishes here, so what you see on a page is the official release.',
  },
  {
    icon: IconSparkle,
    title: 'Clear update status',
    text: 'Each app tells you whether a newer version exists, so you never download an old build.',
  },
  {
    icon: IconHeart,
    title: 'Free and open',
    text: 'No paid services, no subscriptions and no account needed to browse or download.',
  },
]

const PRINCIPLES = [
  'Simple enough to maintain without touching complex tooling',
  'Fast on older Windows 10 laptops and Android phones',
  'Works without a backend today, ready for one later',
  'Every app listed is built and released by ChielSam',
]

export default function About() {
  const apps = getAllApps()
  const stats = getHubStats()

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="page-head__row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="eyebrow">About</span>
              <h1 style={{ fontSize: 'clamp(1.9rem, 1.5rem + 1.6vw, 2.8rem)' }}>
                About CHIELSAM APP HUB
              </h1>
            </div>
            <Badge tone="brand">Phase 1</Badge>
          </div>
          <p className="lead">
            CHIELSAM APP HUB is a multi-app distribution website owned and maintained by ChielSam.
            It is designed to grow: the first app is live, and every future app simply gets added to
            the same catalogue.
          </p>
        </div>

        <div className="about-grid">
          <div className="stack" style={{ gap: 'var(--space-6)' }}>
            <section className="panel">
              <h2 className="panel__title">What this is</h2>
              <div className="about-copy">
                <p>
                  Rather than distributing each app separately, CHIELSAM APP HUB gives every project
                  a shared, professional home. Visitors can browse the catalogue, open an app page,
                  read the description and release notes, and see whether an update is available.
                </p>
                <p>
                  The hub currently lists {apps.length} app: ORINZA, in the Entertainment category,
                  at version 1.0.0. It is the first entry in a catalogue that is designed to hold
                  many more.
                </p>
                <p>
                  Right now the hub runs entirely on local project data. There is no server, no
                  database and no hosting cost. The structure is already prepared so a real backend
                  can be connected later without redesigning the pages.
                </p>
              </div>
            </section>

            <section className="panel" id="roadmap">
              <h2 className="panel__title">What is not here yet</h2>
              <div className="about-copy">
                <p>
                  To keep Phase 1 stable and free, a few things are intentionally placeholders:
                </p>
              </div>
              <FeatureList
                items={[
                  'No APK files are hosted yet — download buttons are disabled placeholders',
                  'No owner authentication, so the dashboard is a read-only visual preview',
                  'No automatic in-app updates; the update status reads local data for now',
                  'No analytics, comments, ratings or purchases',
                ]}
              />
            </section>
          </div>

          <aside className="stack" style={{ gap: 'var(--space-5)' }}>
            <div className="card card--pad">
              <span className="footer__title">Hub at a glance</span>
              <div className="stack" style={{ gap: 14, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted" style={{ fontWeight: 600 }}>
                    Apps published
                  </span>
                  <strong>{stats.totalApps}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted" style={{ fontWeight: 600 }}>
                    Available now
                  </span>
                  <strong>{stats.available}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted" style={{ fontWeight: 600 }}>
                    Categories
                  </span>
                  <strong>{stats.categories}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted" style={{ fontWeight: 600 }}>
                    Releases tracked
                  </span>
                  <strong>{stats.releases}</strong>
                </div>
              </div>
            </div>

            <div className="card card--pad">
              <span className="footer__title">Built for</span>
              <div className="stack" style={{ gap: 12, marginTop: 16 }}>
                <span className="feature-list__item">
                  <span className="feature-list__icon">
                    <IconSmartphone size={13} />
                  </span>
                  <span>Android phones</span>
                </span>
                <span className="feature-list__item">
                  <span className="feature-list__icon">
                    <IconSmartphone size={13} />
                  </span>
                  <span>Tablets</span>
                </span>
                <span className="feature-list__item">
                  <span className="feature-list__icon">
                    <IconCode size={13} />
                  </span>
                  <span>Desktop browsers</span>
                </span>
              </div>
            </div>

            <div className="card card--pad">
              <span className="footer__title">Owner</span>
              <p className="muted" style={{ marginTop: 12 }}>
                ChielSam builds and publishes every app listed here. The dashboard page shows the
                future management tools that will be used to publish future updates.
              </p>
              <Link
                to="/dashboard"
                className="btn btn--secondary btn--sm"
                style={{ marginTop: 16, width: 'fit-content' }}
              >
                View owner dashboard
                <IconArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </div>

        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Principles</span>
              <h2>What the hub stands for</h2>
            </div>
          </div>

          <div className="value-grid">
            {VALUES.map((value) => {
              const ValueIcon = value.icon

              return (
                <article className="value-card" key={value.title}>
                  <span className="value-card__icon">
                    <ValueIcon size={20} />
                  </span>
                  <h3>{value.title}</h3>
                  <p className="muted">{value.text}</p>
                </article>
              )
            })}
          </div>

          <div className="trust-strip" style={{ marginTop: 'var(--space-8)' }}>
            {PRINCIPLES.map((principle) => (
              <span key={principle}>
                <IconShield size={16} />
                {principle}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
