"use client";
import { Metadata } from "@/domain/metadata";
export function BoardForm(props: { metadata: Metadata | null }) {

console.log("Metadata in BoardForm:", props.metadata);

  return (
    <fieldset>
      <legend className="text-lg m-2">Legal Form Details</legend>


      <input type="hidden" name="entityType" value="LEGAL" />
    
      <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-2">
            <label htmlFor="boardType" className="block text-sm font-medium text-gray-700 mb-1">
              Board Type
            </label>
            <select
              id="boardTypeId"
              name="boardTypeId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              defaultValue=""
            >
              <option value="">
                Select board type
              </option>
              {props.metadata?.boardTypes?.map((boardType) => (
                <option key={boardType.id} value={boardType.id}>
                  {boardType.name}
                </option>
              ))}
            </select>
          </div>


          <div className="col-span-1 p-2">
            <label htmlFor="constitutedDate" className="block text-sm font-medium text-gray-700 mb-1">
              Constituted Date
            </label>
                  <input
                    type="date"
                    id="constitutedDate"
                    name="constitutedDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div> 
          <div className="col-span-1 p-2">
            <label htmlFor="dissolvedDate" className="block text-sm font-medium text-gray-700 mb-1">
              Dissolved Date
            </label>
                  <input
                    type="date"
                    id="dissolvedDate"
                    name="dissolvedDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div> 

          <div className="col-span-1 p-2">
            <label htmlFor="effectiveFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Effective From
            </label>
                  <input
                    type="date"
                    id="effectiveFrom"
                    name="effectiveFrom"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div> 
          <div className="col-span-1 p-2">
            <label htmlFor="effectiveUntil" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Until
            </label>
                  <input
                    type="date"
                    id="effectiveUntil"
                    name="effectiveUntil"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div>                               
              
                        
      </div>
    </fieldset>
  );
}