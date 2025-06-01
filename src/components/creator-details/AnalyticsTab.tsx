
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          Detailed analytics and performance metrics for this creator will be implemented here.
        </p>
        {/* TODO: Implement creator analytics */}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
