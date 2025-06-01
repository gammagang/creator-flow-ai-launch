
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CampaignAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          Campaign analytics and metrics will be implemented here.
        </p>
        {/* TODO: Implement analytics dashboard */}
      </CardContent>
    </Card>
  );
};

export default CampaignAnalytics;
