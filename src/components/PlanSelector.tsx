import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plan } from '../types';
import { Check } from 'lucide-react';

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlanId: string;
  onPlanSelect: (planId: string) => void;
}

export function PlanSelector({
  plans,
  selectedPlanId,
  onPlanSelect,
}: PlanSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Plan Type</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Select the plan type that best suits your application's needs.
              Each plan offers different features, resources, and limitations.
              Choose the plan that aligns with your requirements and budget.
            </p>
          </div>
          <Button variant="link" className="text-primary">
            Upgrade Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Plan type</th>
                <th className="text-left py-3 px-4 font-medium">Storage</th>
                <th className="text-left py-3 px-4 font-medium">Bandwidth</th>
                <th className="text-left py-3 px-4 font-medium">
                  Memory (RAM)
                </th>
                <th className="text-left py-3 px-4 font-medium">CPU</th>
                <th className="text-left py-3 px-4 font-medium">
                  Monthly Cost
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Price per hour
                </th>
                <th className="text-left py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <tr
                    key={plan.id}
                    className={`border-b cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => onPlanSelect(plan.id)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{plan.name}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {plan.description}
                      </p>
                    </td>
                    <td className="py-4 px-4">{plan.storage}</td>
                    <td className="py-4 px-4">{plan.bandwidth}</td>
                    <td className="py-4 px-4">{plan.memory}</td>
                    <td className="py-4 px-4">{plan.cpu}</td>
                    <td className="py-4 px-4 font-medium">{plan.monthlyCost}</td>
                    <td className="py-4 px-4">{plan.pricePerHour}</td>
                    <td className="py-4 px-4">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => onPlanSelect(plan.id)}
                        className="h-4 w-4 text-primary border-input bg-background"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
