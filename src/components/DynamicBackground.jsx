import React from 'react';

const DynamicBackground = () => (
  <div className="site-background" aria-hidden="true">
    <div className="bg-orb bg-orb-primary" />
    <div className="bg-orb bg-orb-secondary" />
    <div className="bg-orb bg-orb-tertiary" />
    <div className="bg-beam bg-beam-left" />
    <div className="bg-beam bg-beam-right" />
    <div className="mesh-grid" />
    <div className="bg-noise" />
    <div className="bg-vignette" />
  </div>
);

export default DynamicBackground;
