import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  required?: boolean;
  min?: string;
  max?: string;
}

export function FormField({
  label,
  type,
  value,
  onChange,
  icon: Icon,
  required = true,
  min,
  max
}: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
        {label}{required && '*'}
      </label>
      <div className="relative rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          required={required}
          min={min}
          max={max}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white hover:border-gray-300 font-sans"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </motion.div>
  );
} 