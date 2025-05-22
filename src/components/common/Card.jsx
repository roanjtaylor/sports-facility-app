function Card({ children, className = '', padding = 'p-6', hover = false, ...props }) {
  const hoverClasses = hover ? 'hover:shadow-card-hover transition-shadow duration-200' : '';
  const classes = `card ${padding} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;
