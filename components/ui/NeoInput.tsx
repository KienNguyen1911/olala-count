import React from 'react';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const NeoInput: React.FC<NeoInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-bold text-sm ml-1 uppercase text-black">{label}</label>}
      <input
        className={`
          w-full 
          bg-white 
          text-black
          placeholder:text-gray-500
          border-2 border-black 
          shadow-neo-sm 
          p-3 
          rounded-md 
          font-medium 
          focus:outline-none focus:ring-2 focus:ring-black focus:shadow-neo
          transition-all
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default NeoInput;