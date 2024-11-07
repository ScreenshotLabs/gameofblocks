"use client";

import { DisplayData } from "@/components/DisplayData/DisplayData";
import { Page } from "@/components/Page";
import { themeParams, useSignal } from "@telegram-apps/sdk-react";
import { List } from "@telegram-apps/telegram-ui";

export default function ThemeParamsPage() {
  const tp = useSignal(themeParams.state);

  return (
    <Page>
      <List>
        <DisplayData
          rows={Object.entries(tp).map(([title, value]) => ({
            title: title
              .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
              .replace(/background/, "bg"),
            value,
          }))}
        />
      </List>
    </Page>
  );
}
