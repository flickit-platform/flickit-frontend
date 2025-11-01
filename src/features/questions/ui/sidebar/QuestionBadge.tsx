import { memo } from 'react';
import { Box } from '@mui/material';
import { Text } from '@/components/common/Text';
import i18next from 'i18next';

interface QuestionBadgeProps {
  index: number;
  isActive: boolean;
  isUnanswered?: boolean;
  isOpen: boolean;
}

export const QuestionBadge = memo(({
  index,
  isActive,
  isUnanswered,
  isOpen,
}: QuestionBadgeProps) => {
  const rtl = i18next.language === "fa";

  return (
    <Box
      sx={{
        position: 'relative',
        width: 32,
        height: isOpen ? '100%' : 44,
        borderRadius: '8px',
        display: 'grid',
        placeItems: 'center',
        bgcolor: isActive ? 'primary.main' : 'background.states.selected',
      }}
    >
      {isUnanswered && (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            top: 0,
            [rtl ? 'right' : 'left']: 0,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'error.main',
          }}
        />
      )}
      <Text
        color={isActive ? 'primary.contrastText' : 'text.primary'}
        variant="bodyMedium"
      >
        {index + 1}
      </Text>
    </Box>
  );
});