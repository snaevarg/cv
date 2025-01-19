import {  cvRootUrl, cvTitle } from '/cv.mjs';

const { useState } = React;

 

const ShareButton = ({ platform, url, onClick, children }) => 
  React.createElement('button', {
    onClick: onClick,
    className: "p-2 text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-colors",
    "aria-label": platform.name,
    title: platform.name
  }, 
    platform.icon
  );

const MultiShare = () => {
  const platforms = {
    slack: {
      name: 'Slack',
      color: '#4A154B',
      icon: React.createElement('img', {
         width: "20",
         height: "20",
         src: "/slack.svg"
      }),
      share: () => {
        const url = `slack://channel?team=&id=&message=${encodeURIComponent(`Check out my CV: ${cvRootUrl}`)}`;
        window.open(url, '_blank');
        setTimeout(() => {
          window.open(`https://slack.com/app_redirect?channel=&message=${encodeURIComponent(`Check out my CV: ${cvRootUrl}`)}`, '_blank');
        }, 1000);
      }
    },
      linkedin: {
        name: 'LinkedIn',
        color: '#0077B5',
        icon: React.createElement('img', {
            width: "20",
            height: "20",
            src: "/linkedin.svg"
         }),
        share: () => {
          const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cvRootUrl)}&title=${encodeURIComponent(cvTitle)}`;
          window.open(url, '_blank');
        }
      },
    teams: {
      name: 'Teams',
      color: '#6264A7',
      icon: React.createElement('img', {
        width: "20",
        height: "20",
        src: "/teams.svg"
     }),
      share: () => {
        const url = `https://teams.microsoft.com/share?href=${encodeURIComponent(cvRootUrl)}&msgText=${encodeURIComponent(cvTitle)}`;
        window.open(url, '_blank');
      }
    },
    outlook: {
      name: 'Outlook',
      color: '#0078D4',
      icon: React.createElement('img', {
        width: "20",
        height: "20",
        src: "/outlook.svg"
     }),
      share: () => {
        const url = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(cvTitle)}&body=${encodeURIComponent(`Check out my CV: ${cvRootUrl}`)}`;
        window.open(url, '_blank');
      }
    }
  };

  return React.createElement('div', { 
    className: "flex gap-2"
  },
    Object.entries(platforms).map(([key, platform]) => 
      React.createElement(ShareButton, {
        key,
        platform,
        url: cvRootUrl,
        onClick: platform.share
      })
    )
  );
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('share'));
  root.render(React.createElement(MultiShare));
});