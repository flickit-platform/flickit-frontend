import { FC, PropsWithChildren } from "react";
import Chip from "@mui/material/Chip";
import { styles } from "@styles";
import Box from "@mui/material/Box";
import uniqueId from "@/utils/unique-id";
import { Text } from "./Text";

interface IInfoItems {
  renderMap?: Record<string, (...args: any) => JSX.Element>;
  component?: FC<{ title: string }>;
  info: {
    title: string;
    item: any;
    type?: string;
    action?: JSX.Element;
  };
  bg?: "white";
}

const InfoItem = (props: IInfoItems) => {
  const { info, renderMap, component, bg } = props;

  return renderInfo(info, { component, renderMap, bg });
};

const DefaultInfoItemComponent = (
  props: PropsWithChildren<{
    title: string;
    bg?: "white";
    itemBg?: string;
    action?: JSX.Element;
  }>,
) => {
  const { title, children, bg, itemBg, action } = props;
  return (
    <Text
      mb={1}
      variant="body2"
      sx={{
        ...styles.centerV,
        bgcolor: bg ?? "#f5f2f2",
        py: 0.6,
        px: 1,
        borderRadius: 1,
        alignItems: "baseline",
      }}
      justifyContent="space-between"
    >
      {title}:{" "}
      <Box
        component="strong"
        py={0.2}
        px={0.6}
        bgcolor={itemBg ?? "background.containerLowest"}
        borderRadius={1}
        sx={{ ...styles.centerV }}
      >
        {action && (
          <Box mx={0.5} component="span" display="block">
            {action}
          </Box>
        )}
        {children}
      </Box>
    </Text>
  );
};

const defaultRenderMap: Record<string, (...args: any) => JSX.Element> = {
  tags: (title: string, items: string[], props: any) => (
    <DefaultInfoItemComponent title={title} {...props}>
      {items.length !== 0
        ? items?.map((item) => (
            <Chip
              key={uniqueId()}
              size="small"
              label={item}
              sx={{ ml: 0.3, mt: 0.5 }}
              component="span"
            />
          ))
        : "-"}
    </DefaultInfoItemComponent>
  ),
  array: (title: string, items: string[], props: any) => (
    <DefaultInfoItemComponent title={title} {...props}>
      <Box
        display="flex"
        justifyContent="start"
        flexWrap="wrap"
        marginInlineStart={4}
        marginInlineEnd="unset"
      >
        {items?.length !== 0
          ? items?.map(
              (item, index) =>
                `${item}${index === items.length - 1 ? "" : ","} `,
            )
          : "-"}
      </Box>
    </DefaultInfoItemComponent>
  ),
};

const renderInfo = (
  info: {
    title: string;
    item: any;
    type?: string;
    action?: JSX.Element;
  },
  config: {
    component?: any;
    renderMap?: any;
    useTitleAsFallbackType?: boolean;
    bg?: "white";
  } = {},
) => {
  const {
    component: Component = DefaultInfoItemComponent,
    renderMap = defaultRenderMap,
    useTitleAsFallbackType,
    bg,
  } = config;
  const { title, item, type, action } = info;
  const key = useTitleAsFallbackType ? (type ?? title) : type;

  return key && renderMap[key] ? (
    renderMap[key](title, item, { bg, action })
  ) : (
    <Component title={title} bg={bg} action={action}>
      {item ?? "-"}
    </Component>
  );
};

export default InfoItem;
export { renderInfo };
