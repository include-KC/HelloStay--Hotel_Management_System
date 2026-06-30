function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) {
  return (
    <div className="ui-input-group">
      {label ? (
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <input
        id={id}
        className={`ui-input ${error ? "ui-input--error" : ""} ${className}`}
        {...props}
      />

      {error ? (
        <p className="ui-error-message">{error}</p>
      ) : helperText ? (
        <p className="ui-helper-text">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;