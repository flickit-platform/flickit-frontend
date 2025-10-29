import {useState, SyntheticEvent, lazy, Suspense, useEffect, useMemo} from "react";
import UseEvidence from "@/features/questions/model/useEvidence";
import EvidenceItem from "@/features/questions/ui/evidences/evidenceItem";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { t } from "i18next";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const EvidenceContainer = ({ selectedQuestion }) => {
  const { data,handleChange, selectedId, tabItems, ActiveComponent } = UseEvidence(selectedQuestion?.id);

  return (
      <TabContext value={selectedId}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabItems.map(item =>{
              return  <Tab key={item.value} label={item.label} value={item.value} />
            })}
          </TabList>
        </Box>
        <Suspense fallback={""}>
          <TabPanel value={selectedId}>
            <ActiveComponent EvidenceItem={data} />
          </TabPanel>
        </Suspense>
      </TabContext>
  );
};

export default EvidenceContainer;
