import React from 'react';
import { Progress } from '@/components/ui/progress';

interface RegistrationStepProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Component for a single step in the registration process
 */
const RegistrationStep: React.FC<RegistrationStepProps> = ({ 
  icon, 
  label, 
  isActive, 
  isCompleted 
}) => {
  let stateClass = "text-gray-400";
  if (isActive) stateClass = "text-[#F6C500]";
  if (isCompleted) stateClass = "text-[#F6C500]";

  return (
    <div className={`flex flex-col items-center ${stateClass}`}>
      <div className="mb-2">{icon}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
};

interface RegistrationProgressProps {
  currentStep: number;
  steps: {
    icon: React.ReactNode;
    label: string;
  }[];
}

/**
 * Registration Progress Component
 * 
 * Displays a progress bar with steps for the multi-step registration process
 */
const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ 
  currentStep, 
  steps 
}) => {
  // Calculate percentage completed based on current step
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;
  
  return (
    <div className="mb-10">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <RegistrationStep
            key={index}
            icon={step.icon}
            label={step.label}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
          />
        ))}
      </div>
      <div className="flex items-center">
        <div className="mr-3 text-sm font-medium text-gray-400">Setup Progress</div>
        <div className="flex-grow">
          <Progress 
            value={progressPercentage} 
            className="h-2" 
          />
        </div>
        <div className="ml-3 text-sm font-medium text-[#F6C500]">
          {Math.round(progressPercentage)}% Completed
        </div>
      </div>
    </div>
  );
};

export default RegistrationProgress;