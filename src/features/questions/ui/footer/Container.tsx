import { Suspense } from "react";
import useTabs from "@/features/questions/model/evidenceTabs/useTabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const EvidenceContainer = () => {
  const { handleChange, selectedTab, tabItems, ActiveComponent } = useTabs();

  return (
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabItems.map((item: any) =>{
                const {value, label } = item
              return  <Tab key={value} label={label} value={value} />
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

export default EvidenceContainer;
