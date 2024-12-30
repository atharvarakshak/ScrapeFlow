"use client";
import React, { use } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./Sidebar";

function BreadCrumbHeader() {
  const pathName = usePathname();
  const paths = pathName === "/" ? [""] : pathName.split("/");

  return (
    <div className="flex items-center ">
        <MobileSidebar/>
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index} >
                <BreadcrumbItem >
                    <BreadcrumbLink className="capitalize" href={`/${path}`} >
                        {path === "" ? "home" : path}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </React.Fragment>
              
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default BreadCrumbHeader;
