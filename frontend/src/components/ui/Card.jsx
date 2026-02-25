const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-soft transition-colors duration-200'
  const hoverClasses = hover ? 'hover:shadow-medium hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200' : ''
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

