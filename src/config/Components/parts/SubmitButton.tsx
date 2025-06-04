import React from "react";
import './SubmitButton.css';

type Props = {
  onClick: () => void;
  text: string;
  color?: string;
  borderColor?: string;
  isActive?: boolean;
}

const SubmitButton = ({ onClick, text, color, borderColor, isActive = true }: Props) => {
  return (
    <div 
      style={{
        backgroundColor: color ?? '#3498db',
        border: `1px solid ${borderColor ?? '#3498db'}`,
        cursor: isActive ? 'pointer' : 'not-allowed',
      }} 
      className="saveButton" 
      onClick={() => isActive && onClick()}
    >
      {text}
    </div>
  );
};

export default SubmitButton;