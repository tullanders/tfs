'use client';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
<div className="tds-push">
   <div className="tds-sidebar">
      <div>Sidebar items</div>
   </div>
   <div className="tds-content-push">
      <div className="tds-container-push-fluid">
         <div className="tds-row">
            <div className="tds-col-max-12"> 
                {children}
            </div>
         </div>
      </div>
   </div>
</div>

  );
}
