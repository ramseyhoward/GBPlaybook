import React, { useEffect, useState } from "react";
// import { Link, Outlet, useParams } from "react-router-dom";

import { useDimensionsRef } from "rooks";
// import _ from "lodash";

import { Button, Typography, Divider } from "@mui/material";

import { useData } from "../components/DataContext";
import GBIcon from "../components/GBIcon";
import { Guild } from "./DataContext.d";

function maxBy(data: Array<any>, by: (v: any) => number) {
  return data.reduce((a, b) => (by(a) >= by(b) ? a : b));
}

function itemSize(
  { width, height }: { width: number; height: number },
  count: number,
  extra: number = 0
) {
  if (!width || !height) {
    return undefined;
  }

  const layout = (w: number, h: number) => {
    // the # here is equal to the grid gap, or minimal spacing to use
    // const iw = Math.floor((width - w * 10) / w);
    // const ih = Math.floor((height - h * 10) / h);
    const iw = (width - w * 10) / w;
    // extra 5px is for the divider
    const ih = (height - h * 10 - 5) / h;
    const size = Math.min(iw, ih);
    const margin = (iw - size) / 2;
    return {
      w: iw,
      h: ih,
      size: size,
      margin: margin,
      wx: w,
      hx: h,
    };
  };

  return maxBy(
    // no more guessing, just check every possible layout
    // _.range(1, count + 1)
    Array.from({ length: count }, (_, i) => i + 1).map((n) =>
      layout(n, Math.ceil(count / n) + extra)
    ),
    (layout) => layout.size
  );
}

export interface ControlProps {
  size: number;
}

interface GridIcon {
  key: string;
  name: string;
  icon: string;
  style?: React.CSSProperties;
}

interface GuildGridProps {
  pickTeam?: (guild: string) => void;
  controls?: (props: ControlProps) => [JSX.Element, ((guild: string) => void)?];
  extraIcons?: GridIcon[];
}

export function GuildGrid({ pickTeam, controls, extraIcons }: GuildGridProps) {
  const [ref, dimensions] = useDimensionsRef();
  const { data } = useData();
  const [size, setSize] = useState(0);

  const [controlElement, controlCallback] = controls
    ? controls({ size })
    : [undefined, undefined];

  useEffect(() => {
    if (data && dimensions)
      setSize(itemSize(dimensions, data.Guilds.length ?? 0, 1)?.size ?? 0);
  }, [data, dimensions]);

  if (!data) {
    return null;
  }

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "space-evenly",
          width: "100%",
          height: "100%",
          gap: "10px",
          padding: "5px",
        }}
      >
        {size > 0 && (
          <GuildGridInner
            dimensions={dimensions}
            pickTeam={controlCallback ?? pickTeam}
            controls={controls}
            size={size}
            extraIcons={extraIcons}
          />
        )}
      </div>
      <Divider />
      {controlElement ?? null}
    </div>
  );
}

function GuildGridInner({ dimensions, pickTeam, size, extraIcons }: any) {
  const { data } = useData();
  if (!data || !dimensions) {
    return null;
  }

  const list: GridIcon[] = data.Guilds.map((g: Guild) => ({
    key: g.name,
    name: g.name,
    icon: g.name,
  }));
  // list.push(...(extraIcons ?? []));

  return (
    <>
      {list.map((g, i) => (
        <GridIconButton key={i} g={g} pickTeam={pickTeam} size={size} />
      ))}
    </>
  );
}

export function GridIconButton(props: {
  g: GridIcon;
  pickTeam: (guild: string) => void;
  size: number;
}) {
  const { g, pickTeam, size } = props;
  return (
    <Button
      key={g.key}
      variant="outlined"
      onClick={() => {
        pickTeam && pickTeam(g.key);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        background: "rgba(100%, 100%, 100%, 5%)",
      }}
      sx={{
        "@media (hover: hover)": {
          "& > div": {
            transition: "transform .25s",
          },
          "&:hover > div": {
            transform: "scale(1.2)",
          },
        },
      }}
    >
      <div
        style={{
          display: "flex",
          placeContent: "center",
          placeItems: "center",
          fontSize: size * 0.7,
          // fontSize: size / 1.3125,
          width: "1em",
          height: "1em",
          borderRadius: "50%",
          padding: "0.0625em",
          background: "content-box linear-gradient(to bottom, #000, #333)",
        }}
      >
        <GBIcon
          icon={g.icon}
          className="dark"
          style={{
            flexShrink: 0,
            // zIndex: 1,
            // filter: "drop-shadow(0 0 3px black)",
            filter: "drop-shadow(0 0 0.03em black)",
            ...(g.style || {}),
          }}
        />
      </div>
      <Typography
        variant="caption"
        style={{
          color: "whitesmoke",
          // letterSpacing: "normal",
          textTransform: "capitalize",
          textShadow:
            "1px 1px 1px black, -1px -1px 1px black, 1px -1px 1px black, -1px 1px 1px black, 0 1px 1px black, 1px 0 1px black, 0 -1px 1px black, -1px 0 1px black",
          zIndex: 1,
        }}
      >
        {g.name}
      </Typography>
    </Button>
  );
}
