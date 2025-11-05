import { Suspense } from "react";
import useTabs from "@/features/questions/model/evidenceTabs/useTabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const FooterTabs = () => {
  const { handleChange, selectedTab, tabItems, ActiveComponent, ...rest } = useTabs();

  return (
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabItems.map((item: any) =>{
              return  <Tab key={item.value} label={item.label} value={item.value} />
            })}
          </TabList>
        </Box>
        <Suspense fallback={""}>
          <TabPanel value={selectedTab}>
            <ActiveComponent {...rest} />
          </TabPanel>
        </Suspense>
      </TabContext>
  );
};

export default FooterTabs;
