import { useEffect, useRef } from "react";

interface PlaceDetailsCompactProps {
  placeId: string;
}

export default function PlaceDetailsCompact({
  placeId,
}: PlaceDetailsCompactProps) {
  const ref = useRef<HTMLDivElement>(null);
  console.log(placeId);

  useEffect(() => {
    if (!ref.current) return;

    // 清空再注入新的元素
    ref.current.innerHTML = `
      <gmp-place-details-compact orientation = "horizontal" truncation-preferred slot="control-block-start-inline-center" >
    <gmp-place-details-place-request place = "${placeId}"></gmp-place-details-place-request>
    <gmp-place-content-config>
        <gmp-place-media lightbox-preferred></gmp-place-media>
        <gmp-place-rating></gmp-place-rating>
        <gmp-place-type></gmp-place-type>
        <gmp-place-price></gmp-place-price>
        <gmp-place-accessible-entrance-icon></gmp-place-accessible-entrance-icon>
        <gmp-place-open-now-status></gmp-place-open-now-status>
        <gmp-place-attribution light-scheme-color="gray" dark-scheme-color="white"></gmp-place-attribution>
    </gmp-place-content-config>
  </gmp-place-details-compact>
  <gmp-advanced-marker></gmp-advanced-marker>
    `;
  }, [placeId]);

  return <div ref={ref} className="w-[400px] " />;
}
