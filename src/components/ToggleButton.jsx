const ToggleButton = ({handleTemp}) => {
  return (
    <div className="toggle-wrapper">
          <input
            type="checkbox"
            id="toggle"
            onChange={handleTemp}
          />

          <label htmlFor="toggle">
            <span className="celcius">Celsius</span>
            <span className="fahrenheit">Fahrenheit</span>
          </label>
        </div>
  )
}

export default ToggleButton