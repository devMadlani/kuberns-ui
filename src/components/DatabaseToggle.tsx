import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Label } from './ui/label';
import { Database } from 'lucide-react';
import { DatabaseType } from '../types';

interface DatabaseToggleProps {
  databaseTypes: DatabaseType[];
  enabled: boolean;
  selectedDatabaseTypeId: string;
  onToggle: (enabled: boolean) => void;
  onDatabaseTypeChange: (databaseTypeId: string) => void;
}

export function DatabaseToggle({
  databaseTypes,
  enabled,
  selectedDatabaseTypeId,
  onToggle,
  onDatabaseTypeChange,
}: DatabaseToggleProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Database Selection
          </CardTitle>
          <a href="#" className="text-sm text-primary hover:underline">
            Need Help?
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A valid database connection is essential for storing and managing your
          application's data securely. Connect your database to enable
          data-driven features and ensure seamless data operations.
        </p>

        {!enabled ? (
          <div className="flex gap-3">
            <Button
              onClick={() => onToggle(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Connect Database
            </Button>
            <Button variant="outline" onClick={() => onToggle(false)}>
              Maybe Later
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="database-type">Database Type</Label>
            <Select
              id="database-type"
              value={selectedDatabaseTypeId}
              onChange={(e) => onDatabaseTypeChange(e.target.value)}
            >
              <option value="">Select Database Type</option>
              {databaseTypes.map((db) => (
                <option key={db.id} value={db.id}>
                  {db.name}
                </option>
              ))}
            </Select>
            <Button
              variant="outline"
              onClick={() => onToggle(false)}
              className="mt-2"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
