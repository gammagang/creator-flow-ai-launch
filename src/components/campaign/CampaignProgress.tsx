
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CampaignProgressProps {
  progress: number;
}

const CampaignProgress = ({ progress }: CampaignProgressProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Campaign Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default CampaignProgress;
