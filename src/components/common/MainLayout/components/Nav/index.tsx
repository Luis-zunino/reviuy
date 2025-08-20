import { Button } from "@/components/ui/button";
import { PagesUrls } from "@/enums";
import { cn } from "@/lib/utils";
import { Building2, Menu, MessageSquare, User } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 h-auto"
              onClick={() => {
                redirect(PagesUrls.HOME);
              }}
            >
              <Building2 className="w-6 h-6 mr-2" />
              RevieUy
            </Button>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <User className="w-4 h-4" />
              Iniciar sesión
            </Button>
            <Button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              onClick={() => redirect("/review/create")}
            >
              <MessageSquare className="w-4 h-4" />
              Cuéntanos tu experiencia
            </Button>
          </div>
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="pt-4 space-y-4">
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 text-gray-700"
              >
                <User className="w-4 h-4" />
                Iniciar sesión
              </Button>
              <Button
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => redirect("/review/create")}
              >
                <MessageSquare className="w-4 h-4" />
                Cuéntanos tu experiencia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
