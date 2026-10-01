import { IconCheck } from './icons'

export default function FeatureList({ items }) {
  return (
    <ul className="feature-list">
      {items.map((item) => (
        <li className="feature-list__item" key={item}>
          <span className="feature-list__icon">
            <IconCheck size={13} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
