import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

interface CreatorSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: DiscoverCreatorsQuery) => void;
  onSearch: () => void;
  initialFilters?: DiscoverCreatorsQuery;
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

const CreatorSearchFilters = ({
  searchQuery,
  onSearchChange,
  onFiltersChange,
  onSearch,
  initialFilters,
}: CreatorSearchFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<DiscoverCreatorsQuery>(
    initialFilters || {
      country: [],
      tier: [],
      er: [],
      gender: [],
      category: [],
      language: [],
      bio: [],
    }
  );

  // Update filters when initialFilters prop changes
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);
  const addFilter = (type: keyof DiscoverCreatorsQuery, value: string) => {
    // Gender and country should be single select, not multi-select
    if (type === "gender" || type === "country") {
      const newFilters = {
        ...filters,
        [type]: value === "all" ? [] : [value], // Clear filter if "all" is selected
      };
      setFilters(newFilters);
      onFiltersChange(newFilters);
      return;
    }

    if (filters[type]?.includes(value)) return; // Prevent duplicates

    const newFilters = {
      ...filters,
      [type]: [...(filters[type] || []), value],
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (type: keyof DiscoverCreatorsQuery, value: string) => {
    const newFilters = {
      ...filters,
      [type]: (filters[type] || []).filter((item) => item !== value),
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
      bio: [],
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const countryOptions = [
    "India",
    "United States",
    "United Kingdom",
    "Brazil",
    "Indonesia",
  ];
  const tierOptions = [
    "early",
    "nano",
    "micro",
    "lower-mid",
    "upper-mid",
    "macro",
    "mega",
    "celebrity",
  ];
  const erOptions = ["vlow", "low", "micro", "mid", "macro", "high", "vhigh"];
  const genderOptions = ["male", "female", "n/a"];
  const categoryOptions = [
    "art & design",
    "automobiles",
    "beauty & hygiene",
    "books & writing",
    "business & entrepreneurship",
    "cinema & entertainment",
    "family & relationships",
    "fashion",
    "finance",
    "food & beverages",
    "gaming",
    "health & fitness",
    "home & lifestyle",
    "learning & education",
    "infotainment",
    "vloggers & bloggers",
    "politics",
    "pets & animals",
    "non profits",
    "fan pages",
    "music & dance",
    "motivational",
    "news & journalism",
    "parenting",
    "photography",
    "religion & spirituality",
    "sports",
    "technology",
    "travel & adventure",
    "work & career",
  ];
  const languageOptions = [
    "hindi",
    "english",
    "tamil",
    "telugu",
    "malayalam",
    "kannada",
    "arabic",
    "assamese",
    "bengali",
    "french",
    "gujarati",
    "marathi",
    "nepali",
    "oriya",
    "punjabi",
    "sindhi",
    "sinhala",
    "urdu",
  ];

  return (
    <Card>
      <CardContent className="p-4">
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />{" "}
              <Input
                placeholder="Search by username, niche, or keywords..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              className="border-2 border-orange-300 text-orange-600 rounded-xl h-10 px-4 text-sm"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-xl h-10 px-4 text-sm shadow-[3px_3px_0px_0px_#000] font-semibold transition-all duration-200"
              size="sm"
              onClick={onSearch}
            >
              Search
            </Button>
          </div>
        </div>
        {/* Divider below main search row */}
        <div className="border-b border-orange-100 my-3" />
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-1 mb-4 space-y-2">
            <h3 className="text-base font-semibold text-orange-600 mb-1">
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Country Filter */}
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Country
                </label>
                <Select onValueChange={(value) => addFilter("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Tier Filter */}
              <div>
                <label className="text-xs font-medium mb-1 block">Tier</label>
                <Select onValueChange={(value) => addFilter("tier", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {tier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Engagement Rate Filter */}
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Engagement Rate
                </label>
                <Select onValueChange={(value) => addFilter("er", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ER" />
                  </SelectTrigger>
                  <SelectContent>
                    {erOptions.map((er) => (
                      <SelectItem key={er} value={er}>
                        {er}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>{" "}
              {/* Gender Filter */}
              <div>
                <label className="text-xs font-medium mb-1 block">Gender</label>
                <Select
                  value={filters.gender?.[0] || "all"}
                  onValueChange={(value) => addFilter("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {" "}
                    <SelectItem value="all">All Genders</SelectItem>
                    {genderOptions.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender === "n/a"
                          ? "Not Available"
                          : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Category Filter */}
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Category
                </label>
                <Select onValueChange={(value) => addFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Language Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Language
                </label>
                <Select onValueChange={(value) => addFilter("language", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Bio Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bio</label>
              <Input
                placeholder="Enter bio keywords..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    addFilter("bio", e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <div className="border-b-2 border-orange-100 mt-6" />
          </div>
        )}
        {/* Quick Filters Section */}
        <div className="mt-6">
          <div className="mb-2 text-base font-semibold text-orange-600">
            Popular Categories
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="bg-white border border-gray-200 text-gray-500 rounded px-2 py-0.5 text-xs font-normal">
              Fashion
            </span>
            <span className="bg-white border border-gray-200 text-gray-500 rounded px-2 py-0.5 text-xs font-normal">
              Health & Fitness
            </span>
            <span className="bg-white border border-gray-200 text-gray-500 rounded px-2 py-0.5 text-xs font-normal">
              Food & Beverages
            </span>
            <span className="bg-white border border-gray-200 text-gray-500 rounded px-2 py-0.5 text-xs font-normal">
              Technology
            </span>
            <span className="bg-white border border-gray-200 text-gray-500 rounded px-2 py-0.5 text-xs font-normal">
              Travel & Adventure
            </span>
            <span className="bg-white border border-gray-200 text-gray-500 rounded px-2 py-0.5 text-xs font-normal">
              Beauty & Hygiene
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorSearchFilters;
