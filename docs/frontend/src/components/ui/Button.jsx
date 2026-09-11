function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`ui-button ui-button--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;