import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";

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
        <Typography
          variant="titleMedium"
          onClick={() => handleLanguageChange("en")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
          color="white"
        >
          فا
        </Typography>
      ) : (
        <Typography
          variant="titleMedium"
          onClick={() => handleLanguageChange("fa")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
          }}
          color="white"
        >
          EN
        </Typography>
      )}
    </Box>
  );
};

export default LanguageSelector;
