"use client";

import { Card } from "@/components/ui/card";
import { Filter, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePropertyFilters } from "./hooks";
import { AddressSearchInput } from "@/components/common/AddressSearchInput";
import { RealEstateSearchInput } from "@/components/common";

export const Filters = () => {
  const { activeTab, setActiveTab, handleFilterChange } = usePropertyFilters();

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-center text-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg  font-semibold">Búsqueda</h2>
      </div>

      <div className="relative flex flex-1 w-full items-center gap-3">
        <div className="relative flex-1 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <div className="flex items-center p-2">
            <div className="relative flex-1">
              <div className="space-y-2">
                {activeTab === "address" ? (
                  <AddressSearchInput
                    handleOnClick={handleFilterChange}
                    placeholder="Buscar direcciones..."
                  />
                ) : (
                  <RealEstateSearchInput placeholder="Buscar inmobiliarias..." />
                )}
              </div>
            </div>
            <div className="flex items-center ml-2 border-l border-gray-200 pl-2">
              <button
                onClick={() => setActiveTab("address")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200",
                  activeTab === "address"
                    ? "text-blue-600 bg-blue-50 border border-blue-200"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                <MapPin className="w-3 h-3" />
                Dirección
              </button>
              <button
                onClick={() => setActiveTab("realEstate")}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ml-1",
                  activeTab === "realEstate"
                    ? "text-blue-600 bg-blue-50 border border-blue-200"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                <Building2 className="w-3 h-3" />
                Inmobiliaria
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
