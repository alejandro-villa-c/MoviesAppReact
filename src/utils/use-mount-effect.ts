import { useEffect } from "react";

// eslint-disable-next-line
export const useMountEffect = (callback: () => void) => useEffect(callback, []);

export default useMountEffect;