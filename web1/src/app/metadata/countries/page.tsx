'use client';
import React from "react";
import View from "@/components/countries/View";
import Create from "@/components/countries/Create";
import { TdsAccordion, TdsAccordionItem } from '@scania/tegel-react';
const CountriesPage: React.FC = () => {
    return (
        <main style={{ padding: "2rem" }}>
            <h2>Countries Metadata</h2>
            
            <TdsAccordion>
              <TdsAccordionItem header="Create New Country">
                <Create />
              </TdsAccordionItem>
              <TdsAccordionItem header="View Existing Countries">
                <View />
              </TdsAccordionItem>
            </TdsAccordion>
            
            
        </main>
    );
};

export default CountriesPage;