
import React from 'react';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ params }) => {
  const { id: projectId } = params;

  const handleShareClick = () => {
    const projectUrl = window.location.href;
    navigator.clipboard.writeText(projectUrl)
      .then(() => {
        alert('Project link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy project link: ', err);
      });
  };

  return (
    <div>
      <h1>Project Detail Page</h1>
      <p>Project ID: {projectId}</p>
      <button
        onClick={handleShareClick}
        style={{
          backgroundColor: '#4CAF50', /* Green */
          border: 'none',
          color: 'white',
          padding: '15px 32px',
          textAlign: 'center',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          margin: '4px 2px',
          cursor: 'pointer',
          borderRadius: '8px',
        }}
      >
        Share Project
      </button>
      {/* Add more project information here */}
    </div>
  );
};

export default ProjectDetailPage;
