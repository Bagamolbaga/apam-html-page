const CLOUDINARY_CLOUD_NAME = 'dobdjgonp';

const getCloudinaryUrl = (publicId) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.pdf`;
};

function CountryCard({ country }) {
  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const flagStyle = {
    width: '24px',
    height: '18px',
    objectFit: 'cover',
    borderRadius: '2px',
  };

  const nameStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1f2937',
    flex: 1,
    width: '70px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  };

  const linkHoverStyle = {
    color: '#0f7b85',
  };

  const iconStyle = {
    width: '16px',
    height: '16px',
  };

  const disabledLinkStyle = {
    ...linkStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  };

  // Check if PDF is loaded from Cloudinary (not a local path)
  const isAssetLoaded = country.assetManagementPdf;
  const isPensionsHave = country.pensionsPdf;

  return (
    <div style={cardStyle}>
      <img
        src={`https://flagcdn.com/24x18/${country.countryCode.toLowerCase()}.png`}
        alt={`${country.name} flag`}
        style={flagStyle}
      />
      <span style={nameStyle}>{country.name}</span>
      <div className="linksContainerStyle">
        {isAssetLoaded ? (
          <a
            href={getCloudinaryUrl(country.assetManagementPdf)}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
            onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
            title="Asset Management Report"
          >
            <svg
              style={iconStyle}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-file-text w-3.5 h-3.5"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M10 9H8"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
            </svg>
            <span>Asset Management</span>
          </a>
        ) : null}

        {isPensionsHave ? (
          <a
            href={getCloudinaryUrl(country.pensionsPdf)}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
            onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
            title="Pensions Report"
          >
            <svg
              style={iconStyle}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-file-text w-3.5 h-3.5"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M10 9H8"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
            </svg>
            <span>Pensions</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
