import { GetPeriods } from "@/actions/analytics/getPeriods";
import PeriodSelector from "@/app/(dashboard)/(home)/_components/PeriodSelector";
import {Period} from "@/types/analytics";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import React, { Suspense } from "react";
import StatsCard from "./_components/StatsCard";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { Skeleton } from "@/components/ui/skeleton";

function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const {month, year} = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <StatsCards selectedPeriod={period} />
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}

async function StatsCards({ selectedPeriod }:{
  selectedPeriod: Period;
}) {
  const data = await GetStatsCardsValues(selectedPeriod);

  return (
  <div className='grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]'>
    <StatsCard
      title="Workflow executions"
      value={data.workflowExecutions}
      icon={CirclePlayIcon }
    />
    <StatsCard
      title="Phase executions"
      value={data.phaseExecutions}
      icon={WaypointsIcon}
    />
    <StatsCard
      title="Credits consumed"
      value={data.creditsConsumed}
      icon={CoinsIcon}
    />
  </div>
);
}


function StatsCardSkeleton (){
  return <div className="grid gap-3  lg:gap-8 lg:grid-cols-3 ">
    {[1,2,3].map((index)=>(

      <Skeleton key={index} className="w-full min-h-[120px]"/>
    ))

    }
  </div>
}
export default HomePage;