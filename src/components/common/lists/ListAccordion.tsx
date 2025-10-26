import { FC, ReactElement, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { styles } from "@styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IListAccordion {
  items: any[];
  renderItem: (item: any, index: number, isExpanded: boolean) => ReactElement;
  LiComponent?: FC<{ render: (expanded: boolean) => ReactElement }>;
}

const ListAccordion = (props: IListAccordion) => {
  const { items, renderItem, LiComponent = UnOrderedListAccordionItem } = props;

  return (
    <Box
      component="ul"
      sx={{
        paddingInlineStart: { xs: "0", md: "30px" },
        listStyle: { xs: "none", md: "none" },
      }}
    >
      {items?.map((item: any, index: number) => {
        return (
          <LiComponent
            render={(isExpanded) => renderItem(item, index, isExpanded)}
            key={item?.id}
          />
        );
      })}
    </Box>
  );
};

const UnOrderedListAccordionItem = (props: {
  render: (expanded: boolean) => ReactElement;
}) => {
  const { render } = props;
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Box
      component="li"
      sx={{
        marginBottom: "8px",
        backgroundColor: "white",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <Box
        position="absolute"
        sx={{
          left: 0,
          width: "100%",
          cursor: "pointer",
          zIndex: 1,
          paddingRight: "10px",
          height: "56px",
          borderRadius: 2,
          ...styles.centerV,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <ExpandMoreIcon
          sx={{
            marginInlineStart: "auto",
            marginInlineEnd: "unset",
            color: "#287c71",
            transition: "transform .5s ease",
            transform: expanded ? "rotate(540deg)" : "rotate(0)",
          }}
        />
      </Box>
      <Collapse in={expanded} collapsedSize={56} sx={{ padding: 2 }}>
        {render(expanded)}
      </Collapse>
    </Box>
  );
};

export default ListAccordion;
