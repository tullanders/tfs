"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defineCustomElements } from "@scania/tegel/loader";
import { TdsButton } from "@scania/tegel-react";



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    defineCustomElements(); // Needs to be run in the browser once, before any elements are used.
  }, []);

  return (
    <div className="tds-container">
      <div className="tds-row tds-margin-bottom-4">
        <div className="tds-col-max-12">
          <h1>Welcome to the TFS Organizational Editor</h1>
        </div>
      </div>
      <div className="tds-row">
        <div className="tds-col-lg-8 tds-col-md-10 tds-col-max-12" style={{ margin: '0 auto' }}>
          <div style={{ 
            padding: '3rem', 
            border: '3px solid #041e42', 
            borderRadius: '12px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              🚀 Get Started with Entities
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
              Create, edit and manage your organizational entities with full version control
            </p>
            <TdsButton 
              text="Go to Entities"
              variant="primary"
              size="lg"
              onClick={() => router.push('/entities')}
            />
          </div>
        </div>
        
      </div>
      <p>&nbsp;</p>
    </div>
  );
}
