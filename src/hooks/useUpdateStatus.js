import { useEffect, useState } from 'react'
import { getUpdateStatus, UPDATE_STATES } from '../services/updateService'

/**
 * Reads the update result for one app and re-runs the check when the user asks
 * for it. Replace the service call in `updateService` with a real backend later;
 * this hook and every component using it stay unchanged.
 */
export default function useUpdateStatus(app, installedVersion) {
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    data: null,
  })

  async function check() {
    setStatus((current) => ({ ...current, loading: true, error: null }))

    try {
      const data = await getUpdateStatus(app.slug, installedVersion)
      setStatus({ loading: false, error: null, data })
    } catch (error) {
      setStatus({ loading: false, error, data: null })
    }
  }

  useEffect(() => {
    let active = true

    setStatus({ loading: true, error: null, data: null })

    getUpdateStatus(app.slug, installedVersion)
      .then((data) => {
        if (active) setStatus({ loading: false, error: null, data })
      })
      .catch((error) => {
        if (active) setStatus({ loading: false, error, data: null })
      })

    return () => {
      active = false
    }
  }, [app.slug, installedVersion])

  return { ...status, refresh: check, isUpToDate: status.data?.state === UPDATE_STATES.UP_TO_DATE }
}
