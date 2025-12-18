'use client';
import React from "react";
import Link from "next/link";
const CountriesPage: React.FC = () => {
    return (
          <div className='tds-row' style={{padding: '20px'}}>
              
              <div className='tds-col-sm-6'>
                    <h3>🌍 Entity Metadata</h3>
                  <ul>
                      <li>
                        <Link href="/metadata/countries">
                            Manage Countries
                        </Link>
                      </li>
                      <li>
                        <Link href="/metadata/entitytypes">
                            Manage Entity Types
                        </Link>
                      </li>
                  </ul>
              

              </div>
              <div className='tds-col-sm-6'>
                  <h3>🏢 Legal Entities metadata</h3>
                  <ul>
                      <li>
                        <Link href="/metadata/legaltypes">
                            Manage Legal Entity Types
                        </Link>
                      </li>
                      <li>
                        <Link href="/metadata/legalsetups">
                            Manage Legal Entity Setups
                        </Link>
                      </li>
                  </ul>
                  <h3>🏢 Legal Entities metadata</h3>
                  <ul>
                      <li>
                        <Link href="/metadata/legaltypes">
                            Manage Legal Entity Types
                        </Link>
                      </li>
                      <li>
                        <Link href="/metadata/legalsetups">
                            Manage Legal Entity Setups
                        </Link>
                      </li>
                  </ul>                  
              </div>
          </div>

    );
};

export default CountriesPage;