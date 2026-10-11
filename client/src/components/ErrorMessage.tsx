interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}


interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({message, onRetry}: ErrorMessageProps) {
  return (
    <div className="error-state-container">
      <div className="error-state-card">
        <div className="error-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>Oops! Something went wrong</h3>
        <p className="error-message-text">{message}</p>

        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;