
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Creator {
  id: number;
  creatorName: string;
  campaignName: string;
  lifecycleStage: string;
}

interface CampaignCreatorsProps {
  creators: Creator[];
  campaignId: string;
  getLifecycleStageColor: (stage: string) => string;
}

const CampaignCreators = ({ creators, campaignId, getLifecycleStageColor }: CampaignCreatorsProps) => {
  const navigate = useNavigate();

  const handleCreatorRowClick = (creatorId: number) => {
    navigate(`/campaigns/${campaignId}/creators/${creatorId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator Name</TableHead>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Campaign Lifecycle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.map((creator) => (
              <TableRow
                key={creator.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleCreatorRowClick(creator.id)}
              >
                <TableCell className="font-medium">
                  {creator.creatorName}
                </TableCell>
                <TableCell>{creator.campaignName}</TableCell>
                <TableCell>
                  <Badge
                    className={getLifecycleStageColor(creator.lifecycleStage)}
                  >
                    {creator.lifecycleStage}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CampaignCreators;
