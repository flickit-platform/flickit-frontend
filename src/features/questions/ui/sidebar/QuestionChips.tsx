// components/QuestionChips.tsx
import { memo, useMemo } from 'react';
import { Box, Chip } from '@mui/material';
import type { QuestionIssue } from '../../types';
import { useSidebarUIState } from '../../model/sidebar/useSidebarUIState';

interface QuestionChipsProps {
  issues: QuestionIssue;
  show: boolean;
}

export const QuestionChips = memo(({ issues, show }: QuestionChipsProps) => {
  const { getIssueChipsForQuestion } = useSidebarUIState();
  
  const chips = useMemo(() => getIssueChipsForQuestion(issues), [issues]);

  if (!show || !chips.length) return null;

  return (
    <Box sx={{ mt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          size="small"
          label={chip.label}
          variant="filled"
          sx={(theme) => {
            const palette = theme.palette[chip.tone];
            return {
              borderRadius: 1,
              bgcolor: palette.states?.selected,
              color: palette.main,
              '& .MuiChip-label': { p: 0.5,...theme.typography.labelSmall },
            };
          }}
        />
      ))}
    </Box>
  );
});