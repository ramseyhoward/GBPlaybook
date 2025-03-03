import {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
} from "react";
import {
  ButtonGroup,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppBarContent } from "../App";
import { useData } from "../components/DataContext";
import "./print.css";

import { useMutationObserverRef } from "rooks";

import { CardFront, GBCardCSS } from "../components/CardFront";
import { CardBack } from "../components/CardBack";
import GBIcon from "../components/GBIcon";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Box, Button, IconButton, Divider, Checkbox } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SelectAllIcon from "@mui/icons-material/DoneAll";
import ClearAllIcon from "@mui/icons-material/RemoveDone";
import ClearIcon from "@mui/icons-material/Clear";
import VersionTag from "../components/VersionTag";
import GBImages from "../components/GBImages";
import { Gameplan, Guild, Model } from "../components/DataContext.d";
import {
  GameplanCard,
  GameplanFront,
  ReferenceCard,
  ReferenceCardFront,
} from "../components/Gameplan";

export const CardPrintScreen = () => {
  const { data, gameplans } = useData();
  const ref = useRef<{
    models: Map<string, any>;
    guilds: Map<string, any>;
    gameplans: Map<string, Gameplan>;
    refcards: Map<string, number>;
  }>(null);
  const list = useRef<any>(null);

  if (!data) {
    return null;
  }
  return (
    <Box
      component="main"
      sx={{
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
          <Tooltip title="Print" arrow>
            <IconButton
              size="small"
              onClick={() => {
                window.print();
              }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </AppBarContent>

      <Box className="controls no-print" sx={{ p: "1rem" }}>
        <GuildList ref={list} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: "0.5rem",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <ButtonGroup variant="text" sx={{ mb: "0.5rem" }}>
              <Tooltip title="Select All" arrow>
                <Button
                  onClick={() => {
                    if (!list.current.guild) {
                      return;
                    }
                    ref.current?.guilds
                      .get(list.current.guild)
                      ?.setChecked(true);
                    ref.current?.models.forEach((control: any) => {
                      if (
                        control.m.guild1 === list.current.guild ||
                        control.m.guild2 === list.current.guild
                      ) {
                        control?.setChecked(true);
                      }
                    });

                    if (list.current?.guild === "gameplans") {
                      ref.current?.gameplans.forEach((control: any) => {
                        control?.setChecked(true);
                      });
                    }
                    if (list.current?.guild === "refcards") {
                      ref.current?.refcards.forEach((control: any) => {
                        control?.setChecked(true);
                      });
                    }
                  }}
                >
                  <SelectAllIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Clear All" arrow>
                <Button
                  onClick={() => {
                    ref.current?.guilds
                      .get(list.current.guild)
                      ?.setChecked(false);
                    ref.current?.models.forEach((control: any) => {
                      if (!list.current.guild) {
                        return;
                      }
                      if (
                        control.m.guild1 === list.current.guild ||
                        control.m.guild2 === list.current.guild
                      ) {
                        control?.setChecked(false);
                      }
                    });
                    if (list.current?.guild === "gameplans") {
                      ref.current?.gameplans.forEach((control: any) => {
                        control?.setChecked(false);
                      });
                    }
                    if (list.current?.guild === "refcards") {
                      ref.current?.refcards.forEach((control: any) => {
                        control?.setChecked(false);
                      });
                    }
                  }}
                >
                  <ClearAllIcon />
                </Button>
              </Tooltip>
            </ButtonGroup>
            <VersionTag />
          </Box>
          <ModelLists ref={ref} />
        </Box>
        <Divider />
        <Box>
          <Button
            variant="text"
            color="primary"
            startIcon={<ClearIcon />}
            onClick={() => {
              ref.current?.guilds.forEach((control: any) => {
                control?.setChecked(false);
              });
              ref.current?.models.forEach((control: any) => {
                control?.setChecked(false);
              });
              ref.current?.gameplans.forEach((control: any) => {
                control?.setChecked(false);
              });
              ref.current?.refcards.forEach((control: any) => {
                control?.setChecked(false);
              });
            }}
          >
            Clear Cards
          </Button>
        </Box>
      </Box>

      <Box className="Cards">
        {data.Guilds.map((g: Guild) => (
          <GuildCard name={g.name} key={g.name} />
        ))}
        {data.Models.map((m: Model) => (
          <ModelCard name={m.id} id={m.id} key={m.id} />
        ))}
        {gameplans?.map((gp: Gameplan, index) => (
          <GameplanPrintCard gameplan={gp} key={`gameplan-${index}`} />
        ))}
        {gameplans?.map((gp: Gameplan, index) => (
          <RefcardPrintCard index={index} key={`refcard-${index}`} />
        ))}
      </Box>
    </Box>
  );
};

const GuildList = forwardRef((props, ref) => {
  const [guild, setGuild] = useState<string | undefined>(undefined);

  useImperativeHandle(ref, () => ({ guild }), [guild]);

  const { data } = useData();
  if (!data) {
    return null;
  }

  const SelectGuild = useCallback(
    (name: string) => {
      document
        .querySelectorAll(".model-checkbox")
        .forEach((m) => m.classList.add("hide"));

      const guild = data.Guilds.find((g) => g.name === name);
      if (guild) {
        const { minor } = guild;

        let e = document.querySelector<HTMLElement>(".model-list-container");
        if (minor) {
          e?.style.setProperty("--major-order", "2");
          e?.style.setProperty("--minor-order", "0");
        } else {
          e?.style.setProperty("--major-order", "0");
          e?.style.setProperty("--minor-order", "2");
        }
      }

      document
        .querySelectorAll(`.model-checkbox.${name}`)
        .forEach((m) => m.classList.remove("hide"));
    },
    [data]
  );

  const handleChange = useCallback((event: SelectChangeEvent<any>) => {
    setGuild(event.target.value);
    SelectGuild(event.target.value);
  }, []);

  return (
    <FormControl size="small">
      <InputLabel>Guild</InputLabel>
      <Select label="Guild" onChange={handleChange} defaultValue="">
        <MenuItem key="redcards" value="refcards" dense>
          <ListItemBanner
            text="Rules Reference Cards"
            icon="GB"
            style={{ "--color": "#333333" }}
          />
        </MenuItem>
        <MenuItem key="gameplans" value="gameplans" dense>
          <ListItemBanner
            text="Gameplans"
            icon="GB"
            style={{ "--color": "#333333" }}
          />
        </MenuItem>
        {data.Guilds.map((g: any) => (
          <MenuItem key={g.name} value={g.name} dense>
            <GuildListItem g={g} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

const GuildListItem = ({ g }: { g: Guild }) => (
  <ListItemBanner
    text={g.name}
    icon={g.name}
    style={{ "--color": g.shadow ?? g.color }}
  />
);

const ListItemBanner = ({
  text,
  icon,
  style,
}: {
  text: string;
  icon: string;
  style?: any;
}) => (
  <div
    className="guild"
    key={text}
    style={
      {
        // "--color": g.shadow ?? g.color,
        width: "100%",
        fontSize: "1rem",
        ...style,
      } as CSSProperties
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
          icon={icon}
          className="dark"
          style={{
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
        {text}
      </span>
    </span>
  </div>
);

const DisplayModel = (name: string) => {
  var card = document.querySelector(`.card#${name}`);
  card?.classList.toggle("hide");
};

const GuildCheckBox = forwardRef((props: { g: Guild }, ref) => {
  const [checked, setChecked] = useState(false);
  const g = props.g;
  useImperativeHandle(
    ref,
    () => ({
      g: props.g,
      checked: checked,
      setChecked: (value: boolean) => {
        if (checked !== value) {
          setChecked(value);
          DisplayModel(props.g.name);
        }
      },
    }),
    [props.g, checked, setChecked]
  );
  return (
    <FormControlLabel
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: "primary.main",
      }}
      control={<Checkbox checked={checked} size="small" color="warning" />}
      label={g.name}
      className={`model-checkbox ${g.name} hide ${g.minor ? "minor" : ""}`}
      style={
        {
          "--color1": g.shadow ?? g.color + "80",
          "--color2": "var(--color1)",
        } as CSSProperties
      }
      onChange={() => {
        setChecked(!checked);
        DisplayModel(g.name);
      }}
    />
  );
});

const ModelCheckBox = forwardRef((props: { m: Model }, ref) => {
  const { data } = useData();
  const [checked, setChecked] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      m: props.m,
      checked: checked,
      setChecked: (value: boolean) => {
        if (checked !== value) {
          setChecked(value);
          DisplayModel(props.m.id);
        }
      },
    }),
    [props.m, checked, setChecked]
  );

  if (!data) {
    return null;
  }
  const m = props.m;
  const guild1 = data.Guilds.find((g: Guild) => g.name === m.guild1);
  const guild2 = data.Guilds.find((g: Guild) => g.name === m.guild2);
  if (!guild1) {
    return null;
  }
  return (
    <FormControlLabel
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: "primary.main",
      }}
      control={<Checkbox checked={checked} size="small" color="warning" />}
      label={m.id}
      className={`model-checkbox ${m.guild1} ${m.guild2} ${m.id} hide ${
        guild1.minor ? "minor" : ""
      }`}
      style={
        {
          "--color1": guild1.shadow ?? guild1.color + "80",
          "--color2": guild2
            ? guild2.shadow ?? guild2.color + "80"
            : "var(--color1)",
          // backgroundColor: guild1.shadow ?? guild1.color + "80",
        } as CSSProperties
      }
      onChange={() => {
        setChecked(!checked);
        DisplayModel(m.id);
      }}
    />
  );
});

const GameplanCheckBox = forwardRef((props: { g: Gameplan }, ref) => {
  const [checked, setChecked] = useState(false);
  const g = props.g;
  useImperativeHandle(
    ref,
    () => ({
      g: props.g,
      checked: checked,
      setChecked: (value: boolean) => {
        if (checked !== value) {
          setChecked(value);
          DisplayModel(props.g.title.replace(/[^a-zA-Z0-9]+/g, ""));
        }
      },
    }),
    [props.g, checked, setChecked]
  );
  return (
    <FormControlLabel
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: "primary.main",
      }}
      control={<Checkbox checked={checked} size="small" color="warning" />}
      label={g.title}
      className={`model-checkbox gameplans ${g.title.replace(
        /[^a-zA-Z0-9]/g,
        ""
      )} hide`}
      style={
        {
          "--color1": "#333333",
          "--color2": "var(--color1)",
        } as CSSProperties
      }
      onChange={() => {
        setChecked(!checked);
        DisplayModel(props.g.title.replace(/[^a-zA-Z0-9]+/g, ""));
      }}
    />
  );
});

const RefCardCheckBox = forwardRef((props: { id: number }, ref) => {
  const [checked, setChecked] = useState(false);

  const titles = [
    "Playbook Results",
    "Turn Sequence",
    "Conditions",
    "Spending Momentum",
    "Actions",
  ];

  useImperativeHandle(
    ref,
    () => ({
      id: props.id,
      checked: checked,
      setChecked: (value: boolean) => {
        if (checked !== value) {
          setChecked(value);
          DisplayModel(`refcard-${props.id}`);
        }
      },
    }),
    [props.id, checked, setChecked]
  );
  return (
    <FormControlLabel
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: "primary.main",
      }}
      control={<Checkbox checked={checked} size="small" color="warning" />}
      label={titles[props.id]}
      className={`model-checkbox refcards refcard-${props.id} hide`}
      style={
        {
          "--color1": "#333333",
          "--color2": "var(--color1)",
        } as CSSProperties
      }
      onChange={() => {
        setChecked(!checked);
        DisplayModel(`refcard-${props.id}`);
      }}
    />
  );
});

const ModelLists = forwardRef<{
  models: Map<string, any>;
  guilds: Map<string, any>;
}>((props, ref) => {
  const { data, gameplans } = useData();
  const checkboxes = useRef(new Map());
  const guilds = useRef(new Map());
  const gps = useRef(new Map());
  const refcards = useRef(new Map());
  useImperativeHandle(
    ref,
    () => ({
      models: checkboxes.current,
      guilds: guilds.current,
      gameplans: gps.current,
      refcards: refcards.current,
    }),
    [checkboxes, guilds, gps]
  );
  if (!data || !gameplans) {
    return null;
  }
  return (
    <Box
      className="model-list-container"
      style={
        {
          "--major-order": 0,
          "--minor-order": 2,
        } as CSSProperties
      }
    >
      {gameplans.map((gp: Gameplan) => (
        <GameplanCheckBox
          g={gp}
          key={gp.title}
          ref={(element) => gps.current.set(gp.title, element)}
        />
      ))}
      {[
        "Playbook Results",
        "Turn Sequence",
        "Conditions",
        "Spending Momentum",
        "Actions",
      ].map((title, index) => (
        <RefCardCheckBox
          id={index}
          key={`refcard-${index}`}
          ref={(element) => refcards.current.set(title, element)}
        />
      ))}
      {data.Guilds.map((g: Guild) => (
        <GuildCheckBox
          g={g}
          key={g.name}
          ref={(element) => guilds.current.set(g.name, element)}
        />
      ))}
      {data.Models.map((m: Model) => (
        <ModelCheckBox
          m={m}
          key={m.id}
          ref={(element) => checkboxes.current.set(m.id, element)}
        />
      ))}
    </Box>
  );
});

const ModelCard = (props: { name: string; guild?: string; id: string }) => {
  const { name, id } = props;
  const { data } = useData();

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList, observer) => {
    if (mutationList && mutationList[0]) {
      let { target } = mutationList[0];
      let style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  if (!data) {
    return null;
  }
  const model = data.Models.find((m: any) => m.id === name);
  if (!model) {
    return null;
  }

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
            model={model as any}
            style={
              {
                width: "2.5in",
                borderRadius: 0,
                "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <CardBack
            model={model as any}
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

const GuildCard = (props: { name: string }) => {
  const { name } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList, observer) => {
    if (mutationList && mutationList[0]) {
      let { target } = mutationList[0];
      let style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={name}
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
          <div
            className="card-front"
            style={
              {
                backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
                width: "2.5in",
                borderRadius: 0,
                // "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
          <div
            className="card-back"
            style={
              {
                backgroundImage: `url(${GBImages.get(`${name}_back`)})`,
                width: "2.5in",
                borderRadius: 0,
                // "--scale": "calc(2.5 * 96 / 500)",
              } as GBCardCSS
            }
          />
        </>
      )}
    </div>
  );
};

const GameplanPrintCard = (props: { gameplan: Gameplan }) => {
  const { gameplan } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList, observer) => {
    if (mutationList && mutationList[0]) {
      let { target } = mutationList[0];
      let style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={gameplan.title.replace(/[^A-Za-z0-9]+/g, "")}
      style={{
        position: "relative",
        width: "2.5in",
        height: "3.5in",
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <div
          className="card-front"
          style={
            {
              // backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
              width: "2.5in",
              borderRadius: 0,
              "--scale": "calc(2.5 * 96 / 500)",
            } as GBCardCSS
          }
        >
          <GameplanFront gameplan={gameplan} style={{ borderRadius: 0 }} />
        </div>
      )}
    </div>
  );
};

const RefcardPrintCard = (props: { index: number }) => {
  const { index } = props;

  const [inView, setInView] = useState(false);
  const callback: MutationCallback = (mutationList, observer) => {
    if (mutationList && mutationList[0]) {
      let { target } = mutationList[0];
      let style = getComputedStyle(target as Element);
      setInView(style.getPropertyValue("display") !== "none");
    }
  };
  const [ref] = useMutationObserverRef(callback);

  return (
    <div
      ref={ref}
      className={`card ${!inView ? "hide" : null}`}
      id={`refcard-${index}`}
      style={{
        position: "relative",
        width: "2.5in",
        height: "3.5in",
        display: "inline-flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      {inView && (
        <div
          className="card-front"
          style={
            {
              // backgroundImage: `url(${GBImages.get(`${name}_front`)})`,
              width: "2.5in",
              borderRadius: 0,
              "--scale": "calc(2.5 * 96 / 500)",
            } as GBCardCSS
          }
        >
          <ReferenceCardFront index={index + 1} style={{ borderRadius: 0 }} />
        </div>
      )}
    </div>
  );
};
