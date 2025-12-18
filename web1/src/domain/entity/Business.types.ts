import { EntityBase } from "./EntityBase";

export interface BusinessSpecific {
    //entityType: "BUSINESS"; // Discriminator
    businessField?: string;
    businessValue?: number;
}

export type BusinessEntity = EntityBase & BusinessSpecific;

export type BusinessEntityView = BusinessEntity & {
    entityTypeName?: string;
    entityTypeEmoji?: string;
};