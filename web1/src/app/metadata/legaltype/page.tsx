'use client';
import React from "react";
import View from "@/components/legaltype/View";
import Create from "@/components/legaltype/Create";
import { TdsAccordion, TdsAccordionItem } from '@scania/tegel-react';

const LegalTypesPage: React.FC = () => {
    return (
        <main style={{ padding: "2rem" }}>
            <h2>Legal Types Metadata</h2>
            
            <TdsAccordion>
              <TdsAccordionItem header="Create New Legal Type">
                <Create />
              </TdsAccordionItem>
              <TdsAccordionItem header="View Existing Legal Types">
                <View />
              </TdsAccordionItem>
            </TdsAccordion>
        </main>
    );
};

export default LegalTypesPage;
