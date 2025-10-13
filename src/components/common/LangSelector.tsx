import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import { Text } from "./Text";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    const url = new URL(window.location.href);
    url.searchParams.delete("lang");
    window.history.replaceState({}, document.title, url.pathname + url.search);
    window.location.reload();
  };

  return (
    <Box sx={{ ...styles.centerH }}>
      {i18n.language === "fa" ? (
        <Text
          variant="titleMedium"
          onClick={() => handleLanguageChange("en")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
          color="white"
        >
          EN
        </Text>
      ) : (
        <Text
          variant="titleMedium"
          onClick={() => handleLanguageChange("fa")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
          color="white"
        >
          FA{" "}
        </Text>
      )}
    </Box>
  );
};

export default LanguageSelector;
