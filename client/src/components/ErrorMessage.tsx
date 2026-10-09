interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({message, onRetry}: ErrorMessageProps) {
  return (
    <div className="message error-message">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;