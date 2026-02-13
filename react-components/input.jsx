function Input({ value, onChange, placeholder, ...props }) {
  const inputStyle = {
    display: 'flex',
    height: '40px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    padding: '8px 12px',
    fontSize: '16px',
    lineHeight: '1.5',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  };

  const focusStyle = {
    borderColor: '#007bff',
    boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)'
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => {
        Object.assign(e.target.style, focusStyle);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = inputStyle.border.split(' ')[2];
        e.target.style.boxShadow = 'none';
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
}
