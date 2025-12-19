"use client";
import { BoardForm } from "@/components/entities/BoardForm";
import { LegalForm } from "@/components/entities/LegalForm";
import { Metadata } from "@/domain/metadata";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import {createEntitySchema} from "@/db/schema/entity.schema";
import { useSearchParams } from "next/navigation";

type CreateEntityFormProps = {
  entityType?: string;
};


export function CreateEntityForm() {
  const searchParams = useSearchParams()
  const entityType = searchParams.get("type") || undefined;
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const response = await fetch("/api/metadata");
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetadata();
  }, []);

  


  async function onSubmit(formData: any) {
    
    const data = Object.fromEntries(formData.entries());
    // sätt rätt värde på checkboxar
    data.hasEmployees = data.hasEmployees === 'on' ? true : false;

    // Alla integers måste konverteras
    if (data.legalTypeId) {
      data.legalTypeId = parseInt(data.legalTypeId, 10);
    }
    if (data.legalSetupId) {
      data.legalSetupId = parseInt(data.legalSetupId, 10);
    }
    if (data.numberOfEmployees) {
      data.numberOfEmployees = parseInt(data.numberOfEmployees, 10);
    }
    if (data.boardTypeId) {
      data.boardTypeId = parseInt(data.boardTypeId, 10);
    }

    // Rensa bort tomma värden
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );

    await fetch("/api/entities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedData),
    });
  }
  const allowedTypes = ["LEGAL", "BOARD", "REPORTING_UNIT"];
  

  if (!allowedTypes.includes(entityType ?? "")) {
    return (
      <div>
        <p className="text-red-600">
          Invalid or missing entity type. Please specify a valid type in the URL
          query parameter (e.g., ?type=LEGAL).
        </p>
          <ul>
            <li><a href="?type=LEGAL">LEGAL</a></li>
            <li><a href="?type=BOARD">BOARD</a></li>
            <li><a href="?type=REPORTING_UNIT">REPORTING_UNIT</a></li>
          </ul>
      </div>
    );
  }
  return (
    
    <form action={onSubmit}>
      <fieldset>
        <legend className="text-lg m-2">Create new entity</legend>
              
        <div className="grid grid-cols-3 gap-4 mb-4">

          <div className="p-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Local Name
            </label>
            <input
              type="text"
              id="displayName"
              required
              name="displayName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter local name"
            />
          </div>
          <div className="p-2">
            <label htmlFor="localId" className="block text-sm font-medium text-gray-700 mb-1">
              Local Id
            </label>
            <input
              type="text"
              id="localId"
              name="localId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter local id"
            />          
          </div>
          <div className="p-2">
            <label htmlFor="localIdSource" className="block text-sm font-medium text-gray-700 mb-1">
              Local Id Source
            </label>
            <select
              id="localIdSource"
              name="localIdSource"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              defaultValue=""
            >
              <option value="">
                Local id source:
              </option>
              <option value="HFM">HFM</option>
              <option value="LEMI">LEMI</option>
            </select>

          </div>
        </div>   
      </fieldset>
      {entityType === "LEGAL" && <LegalForm metadata={metadata} />}

      {entityType === "BOARD" && <BoardForm metadata={metadata}/>}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-3 p-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Entity
          </button>
        </div>
      </div>
    </form>
  );
}