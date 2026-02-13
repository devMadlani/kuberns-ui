import { ArrowLeft, Play } from 'lucide-react';
import { Button } from './ui/button';
import { PortConfiguration } from './PortConfiguration';
import { EnvVariablesEditor } from './EnvVariablesEditor';
import { AppFormData } from '../types';

interface Screen2Props {
  formData: AppFormData;
  onFormDataChange: (data: AppFormData) => void;
  onBack: () => void;
  onFinish: () => void;
}

export function Screen2({
  formData,
  onFormDataChange,
  onBack,
  onFinish,
}: Screen2Props) {
  const handlePortTypeChange = (type: 'random' | 'custom') => {
    onFormDataChange({ ...formData, portType: type });
  };

  const handleCustomPortChange = (port: string) => {
    onFormDataChange({ ...formData, customPort: port });
  };

  const handleEnvVariablesChange = (variables: typeof formData.environmentVariables) => {
    onFormDataChange({ ...formData, environmentVariables: variables });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New App</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Connect your repository and fill in the requirements to see the app
          deployed in seconds.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-end gap-2 text-sm">
        <span className="text-muted-foreground text-lg">1</span>
        <span className="text-muted-foreground hidden sm:inline">........</span>
        <span className="font-medium text-primary text-lg">2</span>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        <PortConfiguration
          portType={formData.portType}
          customPort={formData.customPort}
          onPortTypeChange={handlePortTypeChange}
          onCustomPortChange={handleCustomPortChange}
        />

        <EnvVariablesEditor
          variables={formData.environmentVariables}
          onVariablesChange={handleEnvVariablesChange}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onFinish} className="px-6 w-full sm:w-auto">
          Finish my Setup
          <Play className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
