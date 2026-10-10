import { hireScopes } from "@/lib/data/scopes";
import { processSteps } from "@/lib/data/process";
import ServicesPicker from "@/components/ServicesPicker";
import ProcessTimeline from "@/components/ProcessTimeline";

export default function WhatITakeOn() {
  return (
    <section id="services" className="scroll-mt-16 px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-[88rem]">
        <h2 className="hd mb-10 text-4xl text-foreground sm:text-6xl">How I can help.</h2>
        <ServicesPicker scopes={hireScopes} />

        <div id="process" className="mt-40">
          <h3 className="hd text-4xl text-foreground sm:text-6xl">How an engagement runs.</h3>
          <ProcessTimeline steps={processSteps} />
        </div>
      </div>
    </section>
  );
}
