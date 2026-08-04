import React from "react";
import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import { HealthConnectMetricMapping } from "../types/HealthConnectMetricMapping";
import { HealthConnectConfiguration } from "../types/HealthConnectConfiguration";
import { HealthConnectSourceMapping } from "../types/HealthConnectSourceMapping";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MappingPlaceholderListItem from "./MappingPlaceholderListItem";
import MappingRow from "./MappingRow";

type MappingType = HealthConnectMetricMapping | HealthConnectSourceMapping;

interface MetricMappingListItemProps {
  type: "HealthConnectMetricMapping" | "HealthConnectSourceMapping";
  label: string;
  placeholderLabel: string;
  placeholderDescription: string;
  mappings: MappingType[];
  handleMappingChange: (
    key: keyof HealthConnectConfiguration,
    index: number,
    value: Partial<MappingType>,
  ) => void;
  disabled?: boolean;
  divider?: boolean;
  expanded?: boolean;
}

const CollapsibleMappingListItem: React.FC<MetricMappingListItemProps> = (
  props,
) => {
  const {
    type,
    label,
    disabled,
    divider,
    mappings,
    expanded,
    handleMappingChange,
    placeholderLabel,
    placeholderDescription,
  } = props;

  const [isExpanded, setIsExpanded] = React.useState<boolean>(
    expanded ?? false,
  );

  const IconComponent = isExpanded
    ? KeyboardArrowUpIcon
    : KeyboardArrowDownIcon;
  return (
    <ListItem
      divider={divider}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 1,
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
          <IconComponent />
        </IconButton>
      </Box>
      {isExpanded && (
        <List disablePadding sx={{ width: "100%" }}>
          {mappings?.length > 0 ? (
            mappings.map((mapping, index) => (
              <MappingRow
                key={mapping.id}
                type={type}
                mapping={mapping}
                index={index}
                handleMappingChange={handleMappingChange}
                divider={index < mappings.length - 1}
                disabled={disabled}
              />
            ))
          ) : (
            <MappingPlaceholderListItem
              label={placeholderLabel}
              description={placeholderDescription}
            />
          )}
        </List>
      )}
    </ListItem>
  );
};

export default CollapsibleMappingListItem;
