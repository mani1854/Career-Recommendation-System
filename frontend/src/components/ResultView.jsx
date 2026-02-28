export default function ResultView({ result }) {
  const personality = result?.personality
  const scores = result?.result?.scores || {}

  return (
    <div className="card">
      <h2>Your Recommended Direction</h2>
      <h3>{personality?.name}</h3>
      <p>{personality?.description}</p>
      <h4>Suggested Careers</h4>
      <ul>
        {personality?.careers?.map((career) => (
          <li key={career}>{career}</li>
        ))}
      </ul>
      <h4>RIASEC Score Breakdown</h4>
      <div className="scores">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="score-box">
            <span>{key}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
