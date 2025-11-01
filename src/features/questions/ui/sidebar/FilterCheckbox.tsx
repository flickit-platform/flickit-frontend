import { memo } from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { Text } from "@/components/common/Text";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const FilterCheckbox = memo(
  ({ label, checked, onChange }: FilterCheckboxProps) => {
    return (
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
    );
  },
);
