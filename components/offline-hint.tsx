"use client";

import { useEffect, useState } from "react";

export function OfflineHint() {
 const [offline, setOffline] = useState(false);

 useEffect(() => {
 const update = () => {
 setOffline(!navigator.onLine);
 };

 update();
 window.addEventListener("online", update);
 window.addEventListener("offline", update);

 return () => {
 window.removeEventListener("online", update);
 window.removeEventListener("offline", update);
 };
 }, []);

 if (!offline) {
 return null;
 }

 return (
 <p className="mt-2 text-sm font-medium text-amber-200">
 Modo sin conexion. Muestra fallback para ruta no cacheada.
 </p>
 );
}
