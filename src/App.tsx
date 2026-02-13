import { useState } from 'react';
import { Layout } from './components/Layout';
import { Screen1 } from './components/Screen1';
import { Screen2 } from './components/Screen2';
import { AppFormData } from './types';

const initialFormData: AppFormData = {
  githubConnected: false,
  gitlabConnected: false,
  organizationId: '',
  repositoryId: '',
  branchId: '',
  appName: '',
  regionId: '',
  frameworkId: '',
  planId: '',
  databaseEnabled: false,
  databaseTypeId: '',
  portType: 'random',
  customPort: '',
  environmentVariables: [],
};

function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<AppFormData>(initialFormData);

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleFinish = () => {
    // In a real app, this would submit the form data to the backend
    console.log('Form submitted:', formData);
    alert('Setup completed! Check console for form data.');
  };

  return (
    <Layout>
      {currentStep === 1 ? (
        <Screen1
          formData={formData}
          onFormDataChange={setFormData}
          onNext={handleNext}
        />
      ) : (
        <Screen2
          formData={formData}
          onFormDataChange={setFormData}
          onBack={handleBack}
          onFinish={handleFinish}
        />
      )}
    </Layout>
  );
}

export default App;
