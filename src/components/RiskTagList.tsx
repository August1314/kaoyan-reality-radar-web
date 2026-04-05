interface RiskTagListProps {
  tags: string[]
}

export function RiskTagList({ tags }: RiskTagListProps) {
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}
