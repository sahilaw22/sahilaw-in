import React from 'react';

// Technical Career & Education Timeline (Clean Static Vector with Pro Graph Trajectory)
export default function CareerTimeline() {
  return (
    <div className="career-timeline-container" aria-label="Career and Education Timeline">
      <svg
        className="career-timeline-svg"
        viewBox="0 5 570 215"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          {/* Subtle area gradient for career trajectory elevation */}
          <linearGradient id="careerGraphGrad" x1="190" y1="45" x2="430" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Upper track: education periods */}
        {/* Track 1: SP Smart School (PCM, 2021 - 2023) */}
        <text
          x="110"
          y="31"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.65)"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.12em"
          fontFamily="'Space Grotesk', monospace"
        >
          SP SMART (PCM)
        </text>
        <line
          x1="30"
          y1="44"
          x2="190"
          y2="44"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Track 2: B.Tech Computer Science (GCET Jammu, 2024 - 2026+) */}
        <text
          x="350"
          y="31"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.12em"
          fontFamily="'Space Grotesk', monospace"
        >
          B.TECH (GCET)
        </text>
        <line
          x1="270"
          y1="44"
          x2="430"
          y2="44"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 2021-2023: CS fundamentals & C++ */}
        <text
          x="110"
          y="72"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.72)"
          fontSize="10"
          fontWeight="700"
          letterSpacing="0.12em"
          fontFamily="'Space Grotesk', monospace"
        >
          CS FUNDAMENTALS
        </text>
        <text
          x="110"
          y="89"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.48)"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.1em"
          fontFamily="'Space Grotesk', monospace"
        >
          C++ LANGUAGE
        </text>

        {/* Career trajectory step-graph */}
        {/* Subtle trajectory area fill (Flat baseline between 2023-2024, then ascending) */}
        <path
          d="M 190 180 L 190 155 L 270 155 L 350 115 L 395 90 L 430 45 L 430 180 Z"
          fill="url(#careerGraphGrad)"
        />

        {/* Technical graph elevation stem lines */}
        <line
          x1="190"
          y1="155"
          x2="190"
          y2="180"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line
          x1="270"
          y1="155"
          x2="270"
          y2="180"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line
          x1="350"
          y1="115"
          x2="350"
          y2="180"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line
          x1="395"
          y1="90"
          x2="395"
          y2="180"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Graph trajectory vector polyline: straight horizontal line between 2023 and 2024 */}
        <path
          d="M 190 155 L 270 155 L 350 115 L 395 90 L 430 45"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Baseline nodes at 2023 and 2024 */}
        <circle cx="190" cy="155" r="2.2" fill="rgba(255, 255, 255, 0.35)" />
        <circle cx="270" cy="155" r="2.2" fill="rgba(255, 255, 255, 0.45)" />

        {/* Perplexity Technical Graph Marker (2025) */}
        <rect
          x="346.5"
          y="111.5"
          width="7"
          height="7"
          rx="1"
          transform="rotate(45 350 115)"
          fill="#16171d"
          stroke="#9a9aa4"
          strokeWidth="1.5"
        />
        <circle cx="350" cy="115" r="1.5" fill="#9a9aa4" />
        <text
          x="350"
          y="132"
          textAnchor="middle"
          fill="#9a9aa4"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.06em"
          fontFamily="'Space Grotesk', monospace"
        >
          PERPLEXITY
        </text>

        {/* FlyRank AI Technical Graph Marker (2026) */}
        <rect
          x="391.5"
          y="86.5"
          width="7"
          height="7"
          rx="1"
          transform="rotate(45 395 90)"
          fill="#16171d"
          stroke="#9a9aa4"
          strokeWidth="1.5"
        />
        <circle cx="395" cy="90" r="1.5" fill="#9a9aa4" />
        <text
          x="395"
          y="106"
          textAnchor="middle"
          fill="#9a9aa4"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.06em"
          fontFamily="'Space Grotesk', monospace"
        >
          FLYRANK AI
        </text>

        {/* Current status callout */}
        {/* Vertical red drop guideline at 2026 */}
        <line
          x1="430"
          y1="14"
          x2="430"
          y2="180"
          stroke="#ff4444"
          strokeWidth="2"
        />

        {/* Clean horizontal callout pointer to the right */}
        <line
          x1="430"
          y1="24"
          x2="445"
          y2="24"
          stroke="#ff4444"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Red NOW Badge (on the right side) */}
        <rect x="445" y="14" width="42" height="20" rx="4" fill="#ff4444" />
        <text
          x="466"
          y="28"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
          fontWeight="800"
          letterSpacing="0.06em"
          fontFamily="'Space Grotesk', monospace"
        >
          NOW
        </text>

        {/* Current Company Name (on the right side) */}
        <text
          x="445"
          y="48"
          textAnchor="start"
          fill="#ff5555"
          fontSize="11.5"
          fontWeight="800"
          letterSpacing="0.06em"
          fontFamily="'Space Grotesk', monospace"
        >
          BIG BLOCK THEORY
        </text>
        <text
          x="445"
          y="63"
          textAnchor="start"
          fill="rgba(255, 255, 255, 0.65)"
          fontSize="10"
          fontWeight="500"
          fontFamily="'Space Grotesk', monospace"
        >
          Growth & Research
        </text>

        {/* Active static anchor dot at 2026 */}
        <circle cx="430" cy="180" r="9" fill="rgba(255, 68, 68, 0.22)" />
        <circle cx="430" cy="180" r="5" fill="#ff4444" />

        {/* Ruler baseline & ticks (2021-2026) */}
        <line
          x1="30"
          y1="180"
          x2="430"
          y2="180"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.2"
        />

        {/* Major Ticks at each year (2021 to 2026) */}
        {[30, 110, 190, 270, 350, 430].map((x, i) => (
          <line
            key={`major-${i}`}
            x1={x}
            y1="168"
            x2={x}
            y2="180"
            stroke="rgba(255, 255, 255, 0.48)"
            strokeWidth="1.4"
          />
        ))}

        {/* Minor Sub-ticks (4 per year gap = 80 / 5 = 16 step) */}
        {[
          46, 62, 78, 94,
          126, 142, 158, 174,
          206, 222, 238, 254,
          286, 302, 318, 334,
          366, 382, 398, 414
        ].map((x, i) => (
          <line
            key={`minor-${i}`}
            x1={x}
            y1="174"
            x2={x}
            y2="180"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
        ))}

        {/* Year Labels below ruler (2021 through 2025) */}
        {[
          { year: '2021', x: 30 },
          { year: '2022', x: 110 },
          { year: '2023', x: 190 },
          { year: '2024', x: 270 },
          { year: '2025', x: 350 },
        ].map((item) => (
          <text
            key={item.year}
            x={item.x}
            y="206"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.52)"
            fontSize="13.5"
            fontWeight="500"
            fontFamily="'Space Grotesk', monospace"
          >
            {item.year}
          </text>
        ))}

        {/* 2026 Highlighted Year (Active) */}
        <text
          x="430"
          y="206"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="14.5"
          fontWeight="800"
          fontFamily="'Space Grotesk', monospace"
        >
          2026
        </text>
      </svg>
    </div>
  );
}
