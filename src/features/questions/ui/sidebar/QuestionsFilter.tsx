import { memo } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { GenericPopover } from "@/components/common/PopOver";
import { Text } from "@/components/common/Text";

interface FilterItem {
  key: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface QuestionsFilterProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  filters: FilterItem[];
}

export const QuestionsFilter = memo(
  ({ anchorEl, open, onClose, filters }: QuestionsFilterProps) => {
    return (
      <GenericPopover
        id="questions-filter"
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        hideBackdrop
      >
        <FormGroup sx={{ gap: 1 }}>
          {filters.map(({ checked, onChange, label }) => (
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ p: 0, width: 32, height: 32 }}
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                />
              }
              label={
                <Text variant="bodyMedium" color="background.contrastText">
                  {label}
                </Text>
              }
            />
          ))}
        </FormGroup>
      </GenericPopover>
    );
  },
);