export function Loader({ fullPage = false }) {
  const inner = <span className="loader" aria-label="Loading" role="status" />
  if (fullPage) {
    return (
      <div className="loader-fullpage" role="status">
        {inner}
      </div>
    )
  }
  return inner
}
