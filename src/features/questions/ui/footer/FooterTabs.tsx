import { Suspense } from "react";
import useTabs from "@/features/questions/model/evidenceTabs/useTabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Text } from "@/components/common/Text";

const FooterTabs = () => {
  const { handleChange, selectedTab, tabItems, ActiveComponent } = useTabs();
  return (
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabItems.map((item: any) =>{
              return  <Tab key={item.value} label={
                <Text variant="bodyMedium"
                      sx={{
                          textTransform: "none",
                          color: selectedTab === item.value ? "primary.main" : "background.secondaryDark",
                          fontWeight: selectedTab === item.value ? 600 : 400,
                         }}
              >
                {item.label}{"  "}({item.counts})
              </Text>} value={item.value}
              />
            })}
          </TabList>
        </Box>
        <Suspense fallback={""}>
          <TabPanel value={selectedTab}>
            <ActiveComponent />
          </TabPanel>
        </Suspense>
      </TabContext>
  );
};

export default FooterTabs;
