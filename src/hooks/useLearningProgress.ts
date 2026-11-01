import { useEffect, useState } from "react";
import { PROGRESS_EVENT, readPractice } from "@/lib/learningProgress";
export function useLearningProgress(language: string) {
  const [practice,setPractice]=useState(()=>readPractice(language));
  useEffect(()=>{
    const update=()=>setPractice(readPractice(language)); update();
    window.addEventListener(PROGRESS_EVENT,update); window.addEventListener("storage",update);
    const timer=window.setInterval(update,60000);
    return ()=>{window.removeEventListener(PROGRESS_EVENT,update);window.removeEventListener("storage",update);window.clearInterval(timer);};
  },[language]);
  return practice;
}
