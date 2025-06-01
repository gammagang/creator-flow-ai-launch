
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentManagementTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          Content gallery, approval workflow, and content management will be implemented here.
        </p>
        {/* TODO: Implement content management functionality */}
      </CardContent>
    </Card>
  );
};

export default ContentManagementTab;
