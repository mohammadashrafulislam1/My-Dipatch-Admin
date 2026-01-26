import { useEffect, useState } from "react";

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed left-3 bottom-4 w-[90%] max-w-md transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce text-center">
  📱 For a better experience, please use a tablet or PC!
</div>

  );
}
