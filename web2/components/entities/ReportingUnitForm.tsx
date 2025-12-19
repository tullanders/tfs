"use client";

import { useForm } from "react-hook-form";
import {createEntitySchema} from "@/db/schema/entity.schema";

export function ReportingUnitForm() {


  async function onSubmit(data: any) {
    await fetch("/api/entities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return (
    <>
        <div className="border p-2">Reporting Unit</div>
        <div className="border p-2">Col 2, Row 2</div>
        <div className="border p-2">Col 3, Row 2</div>       
    </>
  );
}