import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TouchFeedbackProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  feedbackType?: 'scale' | 'glow' | 'ripple';
  disabled?: boolean;
}

export function TouchFeedback({
  children,
  className,
  onClick,
  feedbackType = 'scale',
  disabled = false
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const getFeedbackClass = () => {
    if (disabled) return '';

    switch (feedbackType) {
      case 'scale':
        return isPressed ? 'scale-95' : '';
      case 'glow':
        return isPressed ? 'shadow-neon' : '';
      case 'ripple':
        return isPressed ? 'ripple-effect' : '';
      default:
        return isPressed ? 'scale-95' : '';
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-150 ease-out',
        getFeedbackClass(),
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleClick}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </div>
  );
}