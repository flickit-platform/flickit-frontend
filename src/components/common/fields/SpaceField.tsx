import { useCallback, useMemo, ReactNode, ComponentProps } from "react";
import { useParams } from "react-router-dom";
import { Trans } from "react-i18next";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import AutocompleteAsyncField from "@common/fields/AutocompleteAsyncField";

type SpaceOption = { id: number | string; title: string; selected?: boolean };

// تمام پراپ‌های AutocompleteAsyncField بجز این چند مورد
type AutoProps = Omit<
  ComponentProps<typeof AutocompleteAsyncField>,
  "options" | "name" | "defaultValue" | "createItemQuery" | "label"
>;

type SpaceFieldProps = AutoProps & {
  queryDataSpaces?: { options?: SpaceOption[] };
  spaces: SpaceOption[];
  label?: ReactNode;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: SpaceOption | null;
  onCreated?: (opt: SpaceOption) => void;
};

export const SpaceField = ({
  queryDataSpaces,
  spaces,
  label,
  name = "space",
  required = true,
  disabled,
  defaultValue,
  onCreated,
  ...rest // هر چی خواستی مثل sx, placeholder, size, fullWidth, data-cy و… رو از اینجا پاس بده
}: SpaceFieldProps) => {
  const { service } = useServiceContext();

  const createSpaceQueryData = useQuery({
    service: (args, config) => service.space.create(args, config),
    runOnMount: false,
  });

  const createItemQuery = useCallback(
    async (inputValue: string) => {
      const response = await createSpaceQueryData.query({
        title: inputValue,
        type: "BASIC",
      });
      const newOption: SpaceOption = { title: inputValue, id: response.id };
      onCreated?.(newOption);
      return newOption;
    },
    [createSpaceQueryData, onCreated],
  );

  const computedDefault = useMemo<SpaceOption | null>(() => {
    if (defaultValue) return defaultValue;
    const fromQuery = queryDataSpaces?.options?.find((i) => i.selected);
    if (fromQuery) return fromQuery;
    return spaces?.find((i) => i.selected) ?? null;
  }, [defaultValue, queryDataSpaces, spaces]);

  return (
    <AutocompleteAsyncField
      options={spaces}
      name={name}
      required={required}
      disabled={disabled}
      defaultValue={computedDefault as any}
      label={label ?? <Trans i18nKey="spaces.space" />}
      createItemQuery={createItemQuery}
      {...rest}
    />
  );
};
