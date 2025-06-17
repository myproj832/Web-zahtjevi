import React from "react";
function WaveBackground() {
  return (
    <div className="wave-container">
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="wave-svg"
      >
        <path
          fill="var(--color-bg)"
          d="M0,192L60,176C120,160,240,128,360,122.7C480,117,600,139,720,144C840,149,960,139,1080,144C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}

export default WaveBackground;