import { memo } from 'react';
import { FormGroup } from '@mui/material';
import { GenericPopover } from '@/components/common/PopOver';
import { FilterCheckbox } from './FilterCheckbox';

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

export const QuestionsFilter = memo(({
  anchorEl,
  open,
  onClose,
  filters,
}: QuestionsFilterProps) => {
  return (
    <GenericPopover
      id="questions-filter"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      hideBackdrop
    >
      <FormGroup sx={{ gap: 1 }}>
        {filters.map((filter) => (
          <FilterCheckbox
            key={filter.key}
            label={filter.label}
            checked={filter.checked}
            onChange={filter.onChange}
          />
        ))}
      </FormGroup>
    </GenericPopover>
  );
});