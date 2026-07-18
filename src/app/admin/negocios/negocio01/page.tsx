'use client'
import DashboardNegocio01 from './DashboardNegocio01';

export default function Page() {
  // ID verificado
  const idNegocio = 'b61fbacb-cc89-4e3e-bf20-aba55f7ec86e';
  
  return <DashboardNegocio01 negocioId={idNegocio} />;
}