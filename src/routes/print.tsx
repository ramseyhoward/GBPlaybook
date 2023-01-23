import React from "react";
import { Typography } from "@mui/material";
import { AppBarContent } from "../App";
import { useData } from "../components/DataContext";
import "./print.css";

import { useState } from "react";
import { useMutationObserverRef } from "rooks";

import { CardFront, GBCardCSS } from "../components/CardFront";
import { CardBack } from "../components/CardBack";
import GBIcon from "../components/GBIcon";
import GBImages from "../components/GBImages";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Box, IconButton, Divider } from "@mui/material";
import { Print } from "@mui/icons-material";

export const CardPrintScreen = () => {
  const { loading, data } = useData();
  if (loading) {
    return null;
  }
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <AppBarContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Card Printer</Typography>
          <IconButton
            onClick={() => {
              window.print();
            }}
          >
            <Print />
          </IconButton>
        </Box>
      </AppBarContent>
      <div className="controls no-print">
        <GuildList />
        <ModelLists />
      </div>
      <Divider />
      <div className="Cards">
        {data.Models.map((m: any) => (
          <Content name={m.id} id={m.id} key={m.id} />
        ))}
      </div>
    </main>
  );
};

/* minor is never passed in, what was the idea here? */
const SelectGuild = (props: { name: string; minor?: boolean }) => {
  const { name, minor } = props;
  document
    .querySelectorAll(".model-checkbox")
    .forEach((m) => m.classList.add("hide"));

  let e = document.querySelector<HTMLElement>(".model-list-container");
  if (minor) {
    e?.style.setProperty("--major-order", "2");
    e?.style.setProperty("--minor-order", "0");
  } else {
    e?.style.setProperty("--major-order", "0");
    e?.style.setProperty("--minor-order", "2");
  }

  document
    .querySelectorAll(`.model-checkbox.${name}`)
    .forEach((m) => m.classList.remove("hide"));
};

const _GuildList = () => {
  const [guild, setGuild] = React.useState<string | undefined>(undefined);
  const handleChange = (event: SelectChangeEvent<string>) => {
    setGuild(event.target.value);
    SelectGuild({ name: event.target.value });
  };
  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Guild</InputLabel>
      <Select label="Guild" value={guild} onChange={handleChange}>
        {data.Guilds.map((g: any) => (
          <MenuItem key={g.name} value={g}>
            {/* {g.name} */}
            <GuildListItem g={g} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const GuildList = () => {
  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gap: "2px",
        // gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(7, 1fr)",
        gridAutoFlow: "column",
      }}
    >
      {data.Guilds.map((g: any) => (
        <GuildListItem key={g.name} g={g} />
      ))}
    </div>
  );
};

const GuildListItem = ({ g }: { g: any }) => {
  return (
    <div
      className="guild"
      key={g.name}
      onClick={() => {
        SelectGuild(g);
      }}
      style={
        {
          "--guild-color": g.shadow ?? g.color,
          width: "15em",
        } as React.CSSProperties
      }
    >
      <span style={{ display: "inline-flex" }}>
        <div
          style={{
            backgroundColor: "black",
            fontSize: "2em",
            width: "1em",
            height: "1em",
            borderRadius: "1em",
            display: "flex",
            overflow: "visible",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GBIcon
            icon={g.name}
            style={{
              // FIXME, this is only working if the
              // svg doesn't have fill color
              color: g.darkColor ?? g.color,
              flexShrink: 0,
            }}
          />
        </div>
        <span
          style={{
            color: "white",
            alignSelf: "center",
            marginLeft: "1em",
            marginRight: "1em",
          }}
        >
          {g.name}
        </span>
      </span>
    </div>
  );
};

const DisplayModel = (name: string) => {
  var check = document.getElementById(name + "-check") as HTMLInputElement;
  var card = document.querySelector(`.card#${name}`);

  // card.classList.toggle("hide");
  if (check?.checked === true) {
    card?.classList.remove("hide");
  } else {
    card?.classList.add("hide");
  }
};

const ModelLists = () => {
  const { data, loading } = useData();
  if (loading) {
    return null;
  }
  return (
    <div
      className="model-list-container"
      style={
        {
          width: "100%",
          "--major-order": 0,
          "--minor-order": 2,
        } as React.CSSProperties
      }
    >
      {data.Models.map((m: any) => {
        const guild1 = data.Guilds.find((g: any) => g.name === m.guild1);
        const guild2 = data.Guilds.find((g: any) => g.name === m.guild2);
        return (
          <label
            className={`model-checkbox ${m.guild1} ${m.guild2} ${m.id} hide ${
              guild1.minor ? "minor" : ""
            }`}
            key={m.id}
            style={
              {
                "--color1": guild1.shadow ?? guild1.color + "80",
                "--color2": guild2
                  ? guild2.shadow ?? guild2.color + "80"
                  : "var(--color1)",
                // backgroundColor: guild1.shadow ?? guild1.color + "80",
              } as React.CSSProperties
            }
          >
            <input
              type="checkbox"
              name={m.id}
              id={`${m.id}-check`}
              key={m.id}
              onChange={() => DisplayModel(m.id)}
            />
            {m.id}
          </label>
        );
      })}
    </div>
  );
};

const Content = (props: { name: string; guild?: string; id: string }) => {
  const { name, guild, id } = props;
  const { data, loading } = useData();

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList, observer) => {
    if (mutationList && mutationList[0]) {
      let { target } = mutationList[0];
      let style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  if (loading) {
    return null;
  }
  const model = data.Models.find((m: any) => m.id === name);

  //   if (GBImages[`${model.id}_gbcp_front`]) {
  //     model.gbcp = true;
  //   }

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={id}
      style={{
        position: "relative",
        width: "5in",
        height: "3.5in",
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <>
          <CardFront
            model={model}
            style={
              {
                width: "2.5in",
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <CardBack
            model={model}
            style={
              {
                width: "2.5in",
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
        </>
      )}
    </div>
  );
};
