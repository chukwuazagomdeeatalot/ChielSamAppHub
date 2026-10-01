import { APP_CATEGORIES, APP_STATUS } from '../data/apps'
import { IconInfo, IconLock, IconPlus } from './icons'

/**
 * Add App placeholder.
 *
 * This form is intentionally not wired to anything. It never saves, never
 * uploads and never calls a service. It exists so the intended workflow is
 * visible, and it will only be made functional when a real backend exists.
 */
export default function AddAppPlaceholder() {
  return (
    <div className="add-app">
      <div className="add-app__notice">
        <IconInfo size={18} />
        <div>
          <strong>Not implemented yet - this form does not save anything.</strong>
          <p>
            In this phase, apps are added by writing one object in{' '}
            <code>src/data/apps.js</code> and pushing to GitHub. That keeps the hub free and
            requires no login. A real Add App screen will appear here once an owner account and a
            database are connected.
          </p>
        </div>
      </div>

      <form className="add-app__form" onSubmit={(event) => event.preventDefault()} aria-disabled="true">
        <div className="add-app__grid">
          <label className="field">
            <span className="field__label">App name</span>
            <input className="field__input" type="text" placeholder="e.g. My New App" disabled />
          </label>

          <label className="field">
            <span className="field__label">URL slug</span>
            <input className="field__input" type="text" placeholder="e.g. my-new-app" disabled />
          </label>

          <label className="field">
            <span className="field__label">Category</span>
            <select className="field__input" defaultValue="" disabled>
              <option value="">Select a category</option>
              {APP_CATEGORIES.filter((category) => category !== 'All').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Status</span>
            <select className="field__input" defaultValue={APP_STATUS.COMING_SOON} disabled>
              <option value={APP_STATUS.COMING_SOON}>{APP_STATUS.COMING_SOON}</option>
              <option value={APP_STATUS.IN_REVIEW}>{APP_STATUS.IN_REVIEW}</option>
              <option value={APP_STATUS.AVAILABLE}>{APP_STATUS.AVAILABLE}</option>
            </select>
          </label>

          <label className="field field--wide">
            <span className="field__label">Short description</span>
            <input
              className="field__input"
              type="text"
              placeholder="One or two sentences shown on the app card"
              disabled
            />
          </label>

          <label className="field field--wide">
            <span className="field__label">Full description</span>
            <textarea
              className="field__input field__input--area"
              rows="3"
              placeholder="The longer description shown on the app page"
              disabled
            />
          </label>

          <label className="field">
            <span className="field__label">Platform</span>
            <input className="field__input" type="text" placeholder="e.g. Android" disabled />
          </label>

          <label className="field">
            <span className="field__label">First version</span>
            <input className="field__input" type="text" placeholder="e.g. 1.0.0" disabled />
          </label>
        </div>

        <div className="add-app__actions">
          <button type="submit" className="btn btn--primary" disabled>
            <IconPlus size={17} />
            Add app
          </button>
          <span className="add-app__hint">
            <IconLock size={15} />
            Disabled on purpose - no backend exists in this phase
          </span>
        </div>
      </form>
    </div>
  )
}
