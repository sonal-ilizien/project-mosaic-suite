import React from 'react';
import { Dialog, DialogContent } from './dialog';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { X, Eye, EyeOff } from 'lucide-react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface CommonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

interface CommonInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

interface CommonTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

interface CommonSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
}

interface CommonCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

interface CommonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

// Main Dialog Component
export const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onOpenChange,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = 'max-w-6xl',
  showCloseButton = true
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[90vh] overflow-hidden p-0 rounded-none border-0 shadow-none [&_.absolute]:text-white [&_.absolute_button]:text-white [&_.absolute_svg]:text-white [&_.absolute_button:hover]:bg-white/20 [&_.absolute_button]:opacity-100 [&_.absolute_button]:hover:opacity-100`}>
        <Card className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl overflow-hidden rounded-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  {subtitle && <p className="text-white/90">{subtitle}</p>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <CardContent className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
            {children}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

// Common Input Component
export const CommonInput: React.FC<CommonInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  className = '',
  showPasswordToggle = false,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}{required && '*'}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 ${isPassword ? 'pr-12' : ''} ${className}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

// Common Textarea Component
export const CommonTextarea: React.FC<CommonTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  rows = 4,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}{required && '*'}
      </Label>
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none ${className}`}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
      </div>
    </div>
  );
};

// Common Select Component
export const CommonSelect: React.FC<CommonSelectProps> = ({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  required = false,
  className = '',
  disabled = false,
  options
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}{required && '*'}
      </Label>
      <div className="relative">
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className={`h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 ${className}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-gray-800 hover:bg-indigo-50">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
      </div>
    </div>
  );
};

// Common Checkbox Component
export const CommonCheckbox: React.FC<CommonCheckboxProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  required = false,
  className = '',
  disabled = false
}) => {
  return (
    <div className="flex items-start gap-4">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className={`mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500 ${className}`}
        disabled={disabled}
      />
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-800">
          {label}{required && '*'}
        </Label>
        {description && <p className="text-xs text-gray-600">{description}</p>}
      </div>
    </div>
  );
};

// Common Button Component
export const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'font-semibold transition-all duration-200 rounded-xl';
  
  const variantClasses = {
    default: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl',
    outline: 'bg-white border-2 border-indigo-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    ghost: 'text-gray-700 hover:bg-gray-100',
    link: 'text-indigo-600 hover:text-indigo-700 underline'
  };

  const sizeClasses = {
    default: 'px-6 py-3 text-sm',
    sm: 'px-4 py-2 text-xs',
    lg: 'px-8 py-4 text-base',
    icon: 'p-3'
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

// Section Header Component
export const CommonSectionHeader: React.FC<{
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}> = ({ title, icon: Icon, className = '' }) => {
  return (
    <h3 className={`flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent ${className}`}>
      {Icon && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
      )}
      {title}
    </h3>
  );
};

// Form Grid Component
export const CommonFormGrid: React.FC<{
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}> = ({ children, cols = 2, className = '' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`grid ${gridClasses[cols]} gap-6 ${className}`}>
      {children}
    </div>
  );
};

// Form Actions Component
export const CommonFormActions: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`flex justify-end space-x-3 pt-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// Tags Component
export const CommonTags: React.FC<{
  tags: string[];
  onRemove?: (tag: string) => void;
  className?: string;
}> = ({ tags, onRemove, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
        >
          {tag}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-2 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}; 