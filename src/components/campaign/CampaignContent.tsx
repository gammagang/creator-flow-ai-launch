
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CampaignContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          Content gallery and approval workflow will be implemented here.
        </p>
        {/* TODO: Implement content gallery */}
      </CardContent>
    </Card>
  );
};

export default CampaignContent;
