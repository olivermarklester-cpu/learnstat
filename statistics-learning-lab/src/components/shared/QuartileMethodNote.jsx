export default function QuartileMethodNote() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex gap-2 items-start">
      <span className="text-blue-500 mt-0.5 shrink-0">ℹ️</span>
      <div>
        <strong>Quartile Method:</strong> This application uses the{' '}
        <strong>inclusive quartile method</strong> (equivalent to Excel's QUARTILE.INC and most
        introductory textbooks). Other software such as R or SPSS may use different methods, so Q1
        and Q3 values may differ slightly.
      </div>
    </div>
  )
}
