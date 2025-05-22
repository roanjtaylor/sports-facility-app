function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const inputClasses = `input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
