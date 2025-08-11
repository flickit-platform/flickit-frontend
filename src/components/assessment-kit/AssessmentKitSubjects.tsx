import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { styles } from "@styles";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { useTheme } from "@mui/material";

interface Attribute {
  id: number;
  title: string;
  description: string;
}

interface Subject {
  id: number;
  title: string;
  description: string;
  attributes: Attribute[];
}

interface Props {
  subjects: Subject[];
}

const AssessmentKitSubjects = ({ subjects }: Props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const subject = subjects[selectedTab];
  const theme = useTheme()

  return (
    <Box>
      {/* Tabs */}
      <Box
        sx={{
          ...styles.rtlStyle(languageDetector(subject.title)),
          borderBottom: `1px solid ${theme.palette.outline?.variant}`,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, newIndex) => setSelectedTab(newIndex)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "none !important",
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
              height: "3px",
            },
          }}
        >
          {subjects.map((s) => (
            <Tab
              key={s.id}
              label={s.title}
              sx={{
                ...theme.typography.semiBoldLarge,
                fontFamily: languageDetector(s.description)
                  ? farsiFontFamily
                  : primaryFontFamily,
                textTransform: "none",
                color: "#333",
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Content */}
      <Box py={3} sx={{ ...styles.rtlStyle(languageDetector(subject.title)) }}>
        <Typography
          variant="bodyLarge"
          sx={{
            mb: 2,
            fontFamily: languageDetector(subject.description)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {subject.description}
        </Typography>

        <List
          dense
          sx={{ ...styles.rtlStyle(languageDetector(subject.title)) }}
        >
          {subject.attributes.map((attr) => (
            <ListItem key={attr.id} alignItems="flex-start" sx={{ pl: 0 }}>
              <ListItemText
                sx={{
                  textAlign: languageDetector(subject.title) ? "right" : "left",
                }}
                primary={
                  <Typography
                    variant="titleMedium"
                    sx={{
                      fontFamily: languageDetector(attr.title)
                        ? farsiFontFamily
                        : primaryFontFamily,
                    }}
                  >
                    • {attr.title}:{" "}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="bodyLarge"
                    sx={{
                      fontFamily: languageDetector(attr.description)
                        ? farsiFontFamily
                        : primaryFontFamily,
                    }}
                  >
                    {attr.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default AssessmentKitSubjects;
