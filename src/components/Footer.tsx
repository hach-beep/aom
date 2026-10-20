import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap footer-row">
        <div>
          <div className="footer-brand">The Bridal Bloom</div>
          <div className="footer-note">Beauty • Grace • Glamour</div>
        </div>
        <div className="footer-note">
          &copy; <span>{currentYear}</span> The Bridal Bloom. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
