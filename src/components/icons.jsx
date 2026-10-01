const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const make = (paths) =>
  function Icon({ size = 20, ...rest }) {
    return (
      <svg {...base} width={size} height={size} {...rest}>
        {paths}
      </svg>
    )
  }

export const IconGrid = make(
  <>
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </>,
)

export const IconStore = make(
  <>
    <path d="M3 9.5 4.8 4.8A1.8 1.8 0 0 1 6.5 3.5h11a1.8 1.8 0 0 1 1.7 1.3L21 9.5" />
    <path d="M3 9.5h18V19a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19z" />
    <path d="M9 20.5v-5.2h6v5.2" />
  </>,
)

export const IconInfo = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.6h.01" />
  </>,
)

export const IconDashboard = make(
  <>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18M9 21V9" />
  </>,
)

export const IconDownload = make(
  <>
    <path d="M12 3v12" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4 19.5h16" />
  </>,
)

export const IconArrowRight = make(
  <>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </>,
)

export const IconChevronRight = make(<path d="m9.5 5.5 6.5 6.5-6.5 6.5" />)

export const IconCheck = make(<path d="m5 12.5 4.5 4.5L19 7.5" />)

export const IconCheckCircle = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.2 2.4 2.4 4.6-5" />
  </>,
)

export const IconSparkle = make(
  <>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9z" />
    <path d="M18.5 3.5v3M20 5h-3" />
  </>,
)

export const IconPlus = make(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
)

export const IconLayers = make(
  <>
    <path d="m12 3 8.5 4.5L12 12 3.5 7.5z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
  </>,
)

export const IconUpload = make(
  <>
    <path d="M12 20V8" />
    <path d="m7.5 12.5 4.5-4.5 4.5 4.5" />
    <path d="M4 4.5h16" />
  </>,
)

export const IconTag = make(
  <>
    <path d="M3.5 11.5V4.5a1 1 0 0 1 1-1h7l9 9-8 8z" />
    <path d="M7.8 7.8h.01" />
  </>,
)

export const IconNotes = make(
  <>
    <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
    <path d="M9 12h6M9 16h4" />
    <path d="M9 8h3" />
  </>,
)

export const IconRocket = make(
  <>
    <path d="M13.5 4.5C17 5 19.5 7.5 20 11c-2.6.7-5.3.4-7.6-.9" />
    <path d="M9.5 11.5 4 17l1 3 3 1 5.5-5.5" />
    <path d="M14.5 9.5 9 15" />
  </>,
)

export const IconRefresh = make(
  <>
    <path d="M20 11.5A8 8 0 0 0 6.2 6.4L4 8.5" />
    <path d="M4 4.5v4h4" />
    <path d="M4 12.5A8 8 0 0 0 17.8 17.6L20 15.5" />
    <path d="M20 19.5v-4h-4" />
  </>,
)

export const IconSearch = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </>,
)

export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />)

export const IconClose = make(<path d="m6 6 12 12M18 6 6 18" />)

export const IconSun = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </>,
)

export const IconMoon = make(<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />)

export const IconShield = make(
  <>
    <path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </>,
)

export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
)

export const IconSmartphone = make(
  <>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 5.5h3" />
    <path d="M10.5 18.5h3" />
  </>,
)

export const IconTablet = make(
  <>
    <rect x="4.5" y="2.5" width="15" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
  </>,
)

export const IconMonitor = make(
  <>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M8.5 20h7M12 16.5V20" />
  </>,
)

export const IconHome = make(
  <>
    <path d="M3.5 10.5 12 3.5l8.5 7" />
    <path d="M5.5 9.5V20h13V9.5" />
  </>,
)

export const IconCompass = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5z" />
  </>,
)

export const IconSettings = make(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.5 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-2-1.2L14.7 3h-4l-.4 2.6c-.7.3-1.4.7-2 1.2l-2.3-1-2 3.4 2 1.5a7.5 7.5 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1c.6.5 1.3.9 2 1.2l.4 2.6h4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
  </>,
)

export const IconLock = make(
  <>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </>,
)

export const IconCode = make(
  <>
    <path d="m8.5 8.5-4 3.5 4 3.5" />
    <path d="m15.5 8.5 4 3.5-4 3.5" />
    <path d="m13.5 5-3 14" />
  </>,
)

export const IconHeart = make(
  <path d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.6 12 20 12 20z" />,
)

export const IconImage = make(
  <>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="m4.5 17 4.5-4.5 3.5 3.5 3-3 4 4" />
    <circle cx="9" cy="9" r="1.4" />
  </>,
)

export const SCREEN_GLYPHS = {
  home: IconHome,
  compass: IconCompass,
  layers: IconLayers,
  settings: IconSettings,
}
