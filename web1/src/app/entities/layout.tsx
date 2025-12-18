import Sidebar from '@/components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<div className="tds-push">
   <div className="tds-sidebar">
      <Sidebar />
   </div>
   <div className="tds-content-push">
      <div className="tds-container-push-fluid">
         <div className="tds-row">
            <div className="tds-col-max-12 tds-col-xxlg-12 tds-col-xlg-12 tds-col-lg-12 tds-col-md-12 tds-col-sm-12 tds-col-xs-12"> 
                {children}
            </div>
         </div>
      </div>
   </div>
</div>

  );
}
