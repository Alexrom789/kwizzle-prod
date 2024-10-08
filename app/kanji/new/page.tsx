import dynamic from "next/dynamic";
import React from "react";

const KanjiForm = dynamic(() => import("@/components/KanjiForm"), {
  ssr: false,
});

const NewKanji = () => {
  return <KanjiForm />;
};

export default NewKanji;
