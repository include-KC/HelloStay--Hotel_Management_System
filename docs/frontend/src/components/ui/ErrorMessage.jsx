function ErrorMessage({ message = "Something went wrong." }) {
  return <p className="ui-error-message">{message}</p>;
}

export default ErrorMessage;