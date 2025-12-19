"use client";
import { Metadata } from "@/domain/metadata";
export function LegalForm(props: { metadata: Metadata | null }) {


  return (
    <fieldset>
      <legend className="text-lg m-2">Legal Form Details</legend>


      <input type="hidden" name="entityType" value="LEGAL" />
    
      <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-2">
            <label htmlFor="legalType" className="block text-sm font-medium text-gray-700 mb-1">
              Legal Type
            </label>
            <select
              id="legalTypeId"
              name="legalTypeId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              defaultValue=""
            >
              <option value="">
                Select legal type
              </option>
              {props.metadata?.legalTypes?.map((legalType) => (
                <option key={legalType.id} value={legalType.id}>
                  {legalType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="p-2">
            <label htmlFor="legalSetup" className="block text-sm font-medium text-gray-700 mb-1">
              Legal Setup
            </label>
            <select
              id="legalSetup"
              name="legalSetup"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              defaultValue=""
            >
              <option value="">
                Select legal setup
              </option>
              {props.metadata?.legalSetups?.map((legalSetup) => (
                <option key={legalSetup.id} value={legalSetup.id}>
                  {legalSetup.name}
                </option>
              ))}
            </select>
          </div>
          <div className="p-2">
            <label htmlFor="countries" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              id="countries"
              name="countries"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              defaultValue=""
            >
              <option value="">
                Select country
              </option>
              <option value="USA">USA</option>
              <option value="CAN">Canada</option>
            </select>

          </div>
          <div className="p-2">
            <label htmlFor="hasEmployees" className="block text-sm font-medium text-gray-700 mb-1">
              Has Employees
            </label>
            <input
              type="checkbox"
              id="hasEmployees"
              name="hasEmployees"
              className="mt-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="p-2">
            <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Employees
            </label>
            <input
              type="number"
              id="numberOfEmployees"
              name="numberOfEmployees"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter number of employees"
            />          
          </div>
          <div></div>




          <div className="col-span-2 p-2">
            <label htmlFor="originalOfficialName" className="block text-sm font-medium text-gray-700 mb-1">
              Original Official Name:
            </label>
            <input
              type="text"
              id="originalOfficialName"
              name="originalOfficialName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter local name"
            />          
          </div>  
          <div className="col-span-1 p-2">
            <label htmlFor="localIdSource" className="block text-sm font-medium text-gray-700 mb-1">
              Original Official Name Valid From
            </label>
                  <input
                    type="date"
                    id="originalOfficialNameValidFrom"
                    name="originalOfficialNameValidFrom"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div> 

          <div className="col-span-2 p-2">
            <label htmlFor="currentOfficialName" className="block text-sm font-medium text-gray-700 mb-1">
              Current Official Name:
            </label>
            <input
              type="text"
              id="currentOfficialName"
              name="currentOfficialName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter local name"
            />          
          </div>  
          <div className="col-span-1 p-2">
            <label htmlFor="currentOfficialNameValidFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Current Official Name Valid From
            </label>
                  <input
                    type="date"
                    id="currentOfficialNameValidFrom"
                    name="currentOfficialNameValidFrom"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div> 

          <div className="col-span-2 p-2">
            <label htmlFor="upcomingOfficialName" className="block text-sm font-medium text-gray-700 mb-1">
              Upcoming Official Name:
            </label>
            <input
              type="text"
              id="upcomingOfficialName"
              name="upcomingOfficialName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter local name"
            />          
          </div>  
          <div className="col-span-1 p-2">
            <label htmlFor="upcomingOfficialNameValidFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Upcoming Official Name Valid From
            </label>
                  <input
                    type="date"
                    id="upcomingOfficialNameValidFrom"
                    name="upcoming  OfficialNameValidFrom"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
          </div>                     
                        
      </div>
    </fieldset>
  );
}