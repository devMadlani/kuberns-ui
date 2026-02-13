import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup } from './ui/radio-group';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Circle, Tag } from 'lucide-react';

interface PortConfigurationProps {
  portType: 'random' | 'custom';
  customPort: string;
  onPortTypeChange: (type: 'random' | 'custom') => void;
  onCustomPortChange: (port: string) => void;
}

export function PortConfiguration({
  portType,
  customPort,
  onPortTypeChange,
  onCustomPortChange,
}: PortConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Port Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You can choose a specific port for your application, or we'll take care
          of it and assign one for you automatically.
        </p>

        <RadioGroup
          options={[
            { value: 'random', label: 'Assign a random port' },
            { value: 'custom', label: 'Set a Custom Port' },
          ]}
          value={portType}
          onValueChange={(value) =>
            onPortTypeChange(value as 'random' | 'custom')
          }
        />

        {portType === 'random' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>localhost/8080</span>
            </div>
            <Badge variant="success" className="ml-auto">
              Random Port Assigned
            </Badge>
          </div>
        )}

        {portType === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="custom-port">Custom Port</Label>
            <Input
              id="custom-port"
              type="number"
              placeholder="Enter port number (e.g., 3000, 8080)"
              value={customPort}
              onChange={(e) => onCustomPortChange(e.target.value)}
              min="1"
              max="65535"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
