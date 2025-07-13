// components/TypewriterText.jsx
import React, { useEffect, useState } from 'react';

const TypewriterBlock = ({ lines = [], typingSpeed = 30 }) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lineIndex < lines.length) {
      if (charIndex < lines[lineIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + lines[lineIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        setDisplayedLines((prev) => [...prev, lines[lineIndex]]);
        setCurrentLine('');
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    } else {
      setDone(true);
    }
  }, [charIndex, lineIndex, lines, typingSpeed]);

  return (
    <div style={{ fontFamily: 'Calibri, Times New Roman, serif', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
      {displayedLines.map((line, idx) => (
        <p key={idx}>• {line}</p>
      ))}
      {!done && (
        <p>
          • {currentLine}
          <span style={{ animation: 'blink 1s finite' }}>|</span>
        </p>
      )}

      {/* Inline blinking cursor keyframe */}
      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default TypewriterBlock;
