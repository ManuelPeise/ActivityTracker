import React from "react";
import { HealthConnectMetricMapping } from "../types/HealthConnectMetricMapping";
import { HealthConnectSourceMapping } from "../types/HealthConnectSourceMapping";
import { HealthConnectConfiguration } from "../types/HealthConnectConfiguration";
import {
  Box,
  Checkbox,
  FormControlLabel,
  ListItem,
  TextField,
} from "@mui/material";

type MappingType = HealthConnectMetricMapping | HealthConnectSourceMapping;

interface MappingRowProps {
  type: "HealthConnectMetricMapping" | "HealthConnectSourceMapping";
  mapping: MappingType;
  index: number;
  divider?: boolean;
  disabled?: boolean;
  handleMappingChange: (
    key: keyof HealthConnectConfiguration,
    index: number,
    value: Partial<MappingType>,
  ) => void;
}

const MappingRow: React.FC<MappingRowProps> = (props) => {
  const { type, mapping, index, handleMappingChange, divider, disabled } =
    props;

  return (
    <ListItem
      key={mapping.id}
      divider={divider}
      sx={{
        display: "flex",
        width: "100%",
        gap: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0.5,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={mapping.isActive}
              disabled={false}
              onChange={() =>
                handleMappingChange(
                  type === "HealthConnectMetricMapping"
                    ? "metricMappings"
                    : "sourceMappings",
                  index,
                  {
                    isActive: !mapping.isActive,
                  },
                )
              }
            />
          }
          label="Is Active"
        />
        {type === "HealthConnectMetricMapping" && (
          <FormControlLabel
            control={<Checkbox checked={mapping.isGranted} disabled={true} />}
            label="Granted"
          />
        )}
        <TextField
          label="Source"
          variant="standard"
          value={mapping.source}
          disabled={true}
        />
        <TextField
          label="Target"
          variant="standard"
          value={mapping.displayName}
          onChange={(value) =>
            handleMappingChange(
              type === "HealthConnectMetricMapping"
                ? "metricMappings"
                : "sourceMappings",
              index,
              {
                displayName: value.target.value,
              },
            )
          }
          disabled={disabled}
        />
      </Box>
    </ListItem>
  );
};

export default React.memo(MappingRow);
