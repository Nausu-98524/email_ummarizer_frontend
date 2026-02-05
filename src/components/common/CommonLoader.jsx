const CommonLoader = ({
  isVisible = true,
  type = "email", // 'email', 'minimal', 'progress', 'cloud', 'dots', 'glass', 'simple', 'steps'
  message = "Syncing emails...",
  subtitle = "Please wait while we fetch your emails",
  current = 0,
  total = 100,
  currentStep = 1,
  steps = [
    "Connecting to servers",
    "Fetching emails",
    "Processing data",
    "Almost done",
  ],
}) => {
  if (!isVisible) return null;

  const percentage =
    total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  // EMAIL SYNC LOADER
  if (type === "email") {
    return (
      <div className="fullpage-loader-overlay">
        <div className="loader-card">
          {/* Animated Envelope */}
          <div className="email-loader">
            <div className="envelope">
              <div className="envelope-body"></div>
              <div className="envelope-flap"></div>
              <div className="sync-icon">↻</div>
            </div>
            <div className="sync-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          {/* Text */}
          <div className="loader-text">
            <h3 className="loader-message">{message}</h3>
            <p className="loader-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  // MINIMAL LOADER
  if (type === "minimal") {
    return (
      <div className="fullpage-loader-overlay dark">
        <div className="minimal-loader">
          <div className="spinner-ring">
            <div className="spinner-border"></div>
            <div className="spinner-icon">↻</div>
          </div>
          <h2 className="loader-message-white">{message}</h2>
          <div className="pulse-dots">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  // PROGRESS LOADER
  if (type === "progress") {
    return (
      <div className="fullpage-loader-overlay">
        <div className="loader-card large">
          <div className="progress-icon">
            <div className="rotating-sync">↻</div>
          </div>
          <h2 className="loader-message">{message}</h2>
          <p className="loader-subtitle">
            Processing {current} of {total} emails
          </p>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%` }}
              >
                <div className="progress-shimmer"></div>
              </div>
            </div>
            <div className="progress-text">{percentage}% Complete</div>
          </div>
        </div>
      </div>
    );
  }

  // CLOUD LOADER
  if (type === "cloud") {
    return (
      <div className="fullpage-loader-overlay cloud-bg">
        <div className="cloud-loader">
          <div className="cloud">
            <div className="cloud-part cloud-back"></div>
            <div className="cloud-part cloud-middle"></div>
            <div className="cloud-part cloud-front"></div>
          </div>
          <div className="cloud-arrows">
            <span className="arrow arrow-up">↑</span>
            <span className="arrow arrow-down">↓</span>
          </div>
          <h2 className="loader-message dark">{message}</h2>
          <p className="loader-subtitle dark">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // DOTS WAVE LOADER
  if (type === "dots") {
    return (
      <div className="fullpage-loader-overlay white">
        <div className="dots-loader">
          <div className="wave-dots">
            <div className="wave-dot"></div>
            <div className="wave-dot"></div>
            <div className="wave-dot"></div>
            <div className="wave-dot"></div>
            <div className="wave-dot"></div>
          </div>
          <h2 className="loader-message dark">{message}</h2>
        </div>
      </div>
    );
  }

  // GLASS LOADER
  if (type === "glass") {
    return (
      <div className="fullpage-loader-overlay glass-bg">
        <div className="glass-card">
          <div className="glass-spinner">
            <div className="glass-border"></div>
            <div className="glass-spin"></div>
            <div className="glass-center">✉️</div>
          </div>
          <h2 className="loader-message-white">{message}</h2>
          <p className="loader-subtitle-white">{subtitle}</p>
          <div className="glass-dots">
            <div className="glass-dot"></div>
            <div className="glass-dot"></div>
            <div className="glass-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  // SIMPLE LOADER
  if (type === "simple") {
    return (
      <div className="fullpage-loader-overlay light">
        <div className="simple-loader">
          <div className="simple-spinner"></div>
          <p className="loader-message dark">{message}</p>
        </div>
      </div>
    );
  }

  // MULTI-STEP LOADER
  if (type === "steps") {
    return (
      <div className="fullpage-loader-overlay dark">
        <div className="steps-card">
          <div className="steps-spinner">
            <div className="steps-border"></div>
            <div className="steps-spin"></div>
          </div>

          <div className="steps-list">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div
                  className={`step-status ${
                    index + 1 < currentStep
                      ? "completed"
                      : index + 1 === currentStep
                        ? "active"
                        : "pending"
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <span className="step-check">✓</span>
                  ) : index + 1 === currentStep ? (
                    <div className="step-pulse"></div>
                  ) : (
                    <span className="step-number">{index + 1}</span>
                  )}
                </div>
                <p
                  className={`step-text ${
                    index + 1 <= currentStep ? "active" : "inactive"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CommonLoader;
