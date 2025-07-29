interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = {
    sm: 'min-h-[32px]',
    md: 'min-h-[400px]',
    lg: 'min-h-[400px]'
  };

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-[#2B5C4B] ${sizeClasses[size]}`}></div>
    </div>
  );
}