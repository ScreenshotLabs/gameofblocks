"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";

export default function Home() {
  const t = useTranslations("i18n");

  return <Page back={false}></Page>;
}
