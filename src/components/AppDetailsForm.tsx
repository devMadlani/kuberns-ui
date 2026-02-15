import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Cloud, Globe } from "lucide-react";
import { Region, Framework } from "../types";

interface AppDetailsFormProps {
  appName: string;
  selectedRegionId: string;
  selectedFrameworkId: string;
  regions: Region[];
  frameworks: Framework[];
  onAppNameChange: (name: string) => void;
  onRegionChange: (regionId: string) => void;
  onFrameworkChange: (frameworkId: string) => void;
}

const regionGroupOrder = [
  "United States",
  "Asia Pacific",
  "Canada",
  "Europe",
  "South America",
] as const;

const resolveRegionGroup = (regionId: string): string => {
  if (regionId.startsWith("us-")) {
    return "United States";
  }

  if (regionId.startsWith("ap-")) {
    return "Asia Pacific";
  }

  if (regionId.startsWith("ca-")) {
    return "Canada";
  }

  if (regionId.startsWith("eu-")) {
    return "Europe";
  }

  if (regionId.startsWith("sa-")) {
    return "South America";
  }

  return "Other";
};

type RegionGroup = {
  groupName: string;
  regions: Region[];
};

export function AppDetailsForm({
  appName,
  selectedRegionId,
  selectedFrameworkId,
  regions,
  frameworks,
  onAppNameChange,
  onRegionChange,
  onFrameworkChange,
}: AppDetailsFormProps) {
  const groupedRegions: RegionGroup[] = regionGroupOrder
    .map((groupName) => ({
      groupName,
      regions: regions.filter((region) => resolveRegionGroup(region.id) === groupName),
    }))
    .filter((group) => group.regions.length > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Fill in the details of your App
          </CardTitle>
          <a href="#" className="text-sm text-primary hover:underline">
            Need Help?
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Enter the basic details of your application such as the name, region
            of deployment and the framework or the template for your
            application.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-name" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                App Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="app-name"
                placeholder="Choose a name"
                value={appName}
                onChange={(e) => onAppNameChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Region <span className="text-destructive">*</span>
              </Label>
              <Select
                id="region"
                value={selectedRegionId}
                onChange={(e) => onRegionChange(e.target.value)}
              >
                <option value="">Choose Region</option>
                {groupedRegions.map((group) => (
                  <optgroup key={group.groupName} label={group.groupName}>
                    {group.regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name} ({region.id})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework" className="flex items-center gap-2">
                Framework / Template <span className="text-destructive">*</span>
              </Label>
              <Select
                id="framework"
                value={selectedFrameworkId}
                onChange={(e) => onFrameworkChange(e.target.value)}
              >
                <option value="">Choose Template</option>
                {frameworks.map((framework) => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
