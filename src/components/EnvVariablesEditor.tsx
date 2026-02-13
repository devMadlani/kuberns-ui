import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { EnvironmentVariable } from '../types';

interface EnvVariablesEditorProps {
  variables: EnvironmentVariable[];
  onVariablesChange: (variables: EnvironmentVariable[]) => void;
}

export function EnvVariablesEditor({
  variables,
  onVariablesChange,
}: EnvVariablesEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleEdit = (variable: EnvironmentVariable) => {
    setEditingId(variable.id);
    setEditKey(variable.key);
    setEditValue(variable.value);
  };

  const handleSave = () => {
    if (editingId) {
      const updated = variables.map((v) =>
        v.id === editingId
          ? { ...v, key: editKey, value: editValue }
          : v
      );
      onVariablesChange(updated);
      setEditingId(null);
      setEditKey('');
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditKey('');
    setEditValue('');
  };

  const handleAdd = () => {
    if (newKey.trim() && newValue.trim()) {
      const newVar: EnvironmentVariable = {
        id: Date.now().toString(),
        key: newKey.trim(),
        value: newValue.trim(),
      };
      onVariablesChange([...variables, newVar]);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDelete = (id: string) => {
    onVariablesChange(variables.filter((v) => v.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Configure Environment Variables
          </CardTitle>
          <a href="#" className="text-sm text-primary hover:underline">
            Need Help?
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Manage and customize environment variables for your application.
          Environment variables are key-value pairs that allow you to configure
          settings, API endpoints, and sensitive information specific to each
          environment. Add, edit, or delete variables to tailor your
          application's behavior and integration with external services.
        </p>

        {variables.length === 0 && editingId === null && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No environment variables added yet.</p>
            <p className="text-xs mt-1">
              Click "Add New" to create your first variable.
            </p>
          </div>
        )}

        {variables.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-4 pb-2 border-b font-medium text-sm text-muted-foreground">
              <div className="col-span-5">Key</div>
              <div className="col-span-5">Value</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {variables.map((variable) => (
              <div
                key={variable.id}
                className="grid grid-cols-12 gap-4 items-center py-2"
              >
                {editingId === variable.id ? (
                  <>
                    <div className="col-span-5">
                      <Input
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                        placeholder="Enter Key"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter Value"
                      />
                    </div>
                    <div className="col-span-2 flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleSave}
                        className="h-8 w-8"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-5 text-sm font-medium">{variable.key}</div>
                    <div className="col-span-5 text-sm text-muted-foreground">
                      {variable.value}
                    </div>
                    <div className="col-span-2 flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(variable)}
                        className="h-8 px-3 text-primary hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(variable.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {editingId === null && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                <Input
                  id="new-key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Enter Key"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAdd();
                    }
                  }}
                />
              </div>
              <div className="col-span-5">
                <Input
                  id="new-value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter Value"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAdd();
                    }
                  }}
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button
                  onClick={handleAdd}
                  className="flex-1"
                  disabled={!newKey.trim() || !newValue.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setNewKey('');
                    setNewValue('');
                  }}
                  className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAdd}
              variant="outline"
              className="w-full"
              disabled={!newKey.trim() || !newValue.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
