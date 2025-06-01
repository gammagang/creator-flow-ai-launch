
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface CreatorSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const CreatorSearchFilters = ({ searchQuery, onSearchChange }: CreatorSearchFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search by username, niche, or keywords..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Search Creators
            </Button>
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">Fashion</Badge>
          <Badge variant="secondary">Fitness</Badge>
          <Badge variant="secondary">Food</Badge>
          <Badge variant="secondary">Tech</Badge>
          <Badge variant="secondary">Travel</Badge>
          <Badge variant="secondary">Beauty</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorSearchFilters;
