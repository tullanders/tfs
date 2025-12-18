'use client';
import React from "react";
import View from "@/components/legalsetup/View";
import Create from "@/components/legalsetup/Create";
import { TdsAccordion, TdsAccordionItem } from '@scania/tegel-react';

const LegalSetupPage: React.FC = () => {
    return (
        <main style={{ padding: "2rem" }}>
            <h2>Legal Setup Metadata</h2>
            
            <TdsAccordion>
              <TdsAccordionItem header="Create New Legal Setup">
                <Create />
              </TdsAccordionItem>
              <TdsAccordionItem header="View Existing Legal Setups">
                <View />
              </TdsAccordionItem>
            </TdsAccordion>
        </main>
    );
};

export default LegalSetupPage;
