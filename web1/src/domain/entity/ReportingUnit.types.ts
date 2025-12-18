import { EntityBase } from "./EntityBase";

export interface ReportingUnitSpecific {
    //entityType: "REPORTING_UNIT"; // Discriminator
    reportingUnitCode?: string;
}

export type ReportingUnitEntity = EntityBase & ReportingUnitSpecific;