import { Typography } from "@mui/material";
import AdviceItemsAccordion from "@/components/dashboard/advice-tab/advice-items/AdviceItemsAccordions";
import { styles } from "@styles";
import { t } from "i18next";

export default function AdviceSection({ advice, lang, rtl }: any) {
  const lng = lang?.code?.toLowerCase();
  return advice?.narration || advice?.adviceItems?.length ? (
    <>
      <Typography textAlign="justify" variant="bodyMedium" sx={{ ...styles.rtlStyle(rtl) }}
        dangerouslySetInnerHTML={{ __html: advice?.narration }} />
      <AdviceItemsAccordion
        items={advice?.adviceItems}
        onDelete={() => {}}
        setDisplayedItems={() => {}}
        query={undefined}
        readOnly
        language={lng}
      />
    </>
  ) : (
    <Typography textAlign="justify" variant="titleSmall" fontWeight="light" mt={2} sx={{ ...styles.rtlStyle(rtl) }}>
      {t("common.unavailable", { lng })}
    </Typography>
  );
}
