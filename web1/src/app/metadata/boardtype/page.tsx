'use client';
import React from "react";
import View from "@/components/boardtype/View";
import Create from "@/components/boardtype/Create";
import { TdsAccordion, TdsAccordionItem } from '@scania/tegel-react';

const BoardTypesPage: React.FC = () => {
    return (
        <main style={{ padding: "2rem" }}>
            <h2>Board Types Metadata</h2>
            <TdsAccordion>
              <TdsAccordionItem header="Create New Board Type">
                <Create />
              </TdsAccordionItem>
              <TdsAccordionItem header="View Existing Board Types">
                <View />
              </TdsAccordionItem>
            </TdsAccordion>
        </main>
    );
};

export default BoardTypesPage;
