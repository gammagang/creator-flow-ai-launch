
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface CreatorSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: DiscoverCreatorsQuery) => void;
}

interface DiscoverCreatorsQuery {
  country?: string[];
  tier?: string[];
  er?: string[];
  gender?: string[];
  category?: string[];
  language?: string[];
  bio?: string[];
}

const CreatorSearchFilters = ({ searchQuery, onSearchChange, onFiltersChange }: CreatorSearchFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<DiscoverCreatorsQuery>({
    country: [],
    tier: [],
    er: [],
    gender: [],
    category: [],
    language: [],
    bio: []
  });

  const addFilter = (type: keyof DiscoverCreatorsQuery, value: string) => {
    const newFilters = {
      ...filters,
      [type]: [...(filters[type] || []), value]
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (type: keyof DiscoverCreatorsQuery, value: string) => {
    const newFilters = {
      ...filters,
      [type]: (filters[type] || []).filter(item => item !== value)
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      country: [],
      tier: [],
      er: [],
      gender: [],
      category: [],
      language: [],
      bio: []
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const countryOptions = ["India", "Australia", "USA", "UK", "Canada", "Germany"];
  const tierOptions = ["Nano", "Micro", "Macro", "Mega"];
  const erOptions = ["1-3%", "3-6%", "6-10%", "10%+"];
  const genderOptions = ["Male", "Female", "Non-binary"];
  const categoryOptions = ["Fashion", "Fitness", "Food", "Tech", "Travel", "Beauty", "Lifestyle", "Gaming"];
  const languageOptions = ["English", "Spanish", "Hindi", "French", "German", "Portuguese"];

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
            <Button 
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Search Creators
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Country Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select onValueChange={(value) => addFilter('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tier Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tier</label>
                <Select onValueChange={(value) => addFilter('tier', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map(tier => (
                      <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement Rate Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Engagement Rate</label>
                <Select onValueChange={(value) => addFilter('er', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ER" />
                  </SelectTrigger>
                  <SelectContent>
                    {erOptions.map(er => (
                      <SelectItem key={er} value={er}>{er}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <Select onValueChange={(value) => addFilter('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map(gender => (
                      <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select onValueChange={(value) => addFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select onValueChange={(value) => addFilter('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map(language => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bio Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bio Keywords</label>
              <Input 
                placeholder="Enter bio keywords..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addFilter('bio', e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            {/* Applied Filters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Applied Filters:</span>
                {Object.values(filters).some(arr => arr && arr.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([type, values]) =>
                  values?.map(value => (
                    <Badge key={`${type}-${value}`} variant="secondary" className="flex items-center gap-1">
                      {type}: {value}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeFilter(type as keyof DiscoverCreatorsQuery, value)}
                      />
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => addFilter('category', 'Fashion')}
          >
            Fashion
          </Badge>
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => addFilter('category', 'Fitness')}
          >
            Fitness
          </Badge>
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => addFilter('category', 'Food')}
          >
            Food
          </Badge>
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => addFilter('category', 'Tech')}
          >
            Tech
          </Badge>
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => addFilter('category', 'Travel')}
          >
            Travel
          </Badge>
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => addFilter('category', 'Beauty')}
          >
            Beauty
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorSearchFilters;
