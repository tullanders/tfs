'use client';
import React from "react";
import View from "@/components/entitytype/View";
import Create from "@/components/entitytype/Create";
import { TdsAccordion, TdsAccordionItem } from '@scania/tegel-react';

const EntityTypesPage: React.FC = () => {
    return (
        <main style={{ padding: "2rem" }}>
            <h2>Entity Types Metadata</h2>
            
            <TdsAccordion>
              <TdsAccordionItem header="Create New Entity Type">
                <Create />
              </TdsAccordionItem>
              <TdsAccordionItem header="View Existing Entity Types">
                <View />
              </TdsAccordionItem>
            </TdsAccordion>
        </main>
    );
};

export default EntityTypesPage;
