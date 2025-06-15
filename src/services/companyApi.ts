import { apiService } from "./api";

interface CompanyResponse {
  data: Company | null;
}

export interface Company {
  id: string;
  name: string;
  owner_name: string;
  website: string;
  category: string;
  description: string;
  meta: {
    phone: string;
  };
  user_id: string;
}

export const companyApi = {
  getMyCompany: async () => {
    return apiService.get<CompanyResponse>("/company/mine");
  },
};
