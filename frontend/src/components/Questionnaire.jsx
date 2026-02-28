const SCALE = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']

export default function Questionnaire({ questions, answers, setAnswer, onSubmit, loading }) {
  return (
    <div className="card">
      <h2>Aptitude + Personality Questions (RIASEC)</h2>
      {questions.map((item, index) => (
        <div key={`${item.type}-${index}`} className="question">
          <p>
            <strong>{index + 1}.</strong> {item.question}
          </p>
          <div className="scale">
            {SCALE.map((label, value) => (
              <label key={label}>
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={answers[item.type]?.[item.question] === value}
                  onChange={() => setAnswer(item.type, item.question, value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onSubmit} disabled={loading}>
        {loading ? 'Calculating...' : 'Submit Assessment'}
      </button>
    </div>
  )
}
