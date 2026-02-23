import { Outlet } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

export function DashboardLayout() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="h-screen flex flex-col flex-grow overflow-x-hidden">
        <div className="min-w-full min-h-full overflow-auto">
          <Card className="min-w-full min-h-full flex flex-col bg-[#f9fafb] dark:bg-[#18191a] rounded-sm">
            <CardBody className="flex-grow p-1 overflow-x-hidden">
              <div className="w-full overflow-x-auto p-8 pb-0">
                <Outlet />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
