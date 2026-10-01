import { SCREEN_GLYPHS, IconImage } from './icons'

export default function ScreenshotPlaceholder({ screenshots = [] }) {
  return (
    <div className="screens">
      {screenshots.map((shot) => {
        const Glyph = SCREEN_GLYPHS[shot.glyph] || IconImage

        return (
          <figure className="screen" key={shot.label}>
            <span className="screen__glyph">
              <Glyph size={22} />
            </span>
            <figcaption className="screen__label">{shot.label}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}
