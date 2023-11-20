import React, { useEffect, useState } from "react";
import "./App.css";

import Data from "./data.json";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, Delete, Search } from "@mui/icons-material";
interface Data {
  id: string;
  artists: string | undefined;
  name: string;
  year: string;
}

const ITEMS_PER_PAGE: number = 100;

function App() {
  const [data, setData] = useState<any[]>(Data as any[]);
  const [search, setSearch] = useState<string>("");

  const [filteredData, setFilteredData] = useState<Data[]>(Data as Data[]);
  const [dataInPage, setDataInPage] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(
    Math.ceil(data.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (!filteredData) {
      setDataInPage([]);
      return;
    }
    const newData = filteredData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    setDataInPage(newData);
  }, [filteredData, currentPage]);

  const handleSearch = () => {
    if (!data) setFilteredData([]);
    if (!search)
      setFilteredData(data.filter((item: Data) => item?.id !== undefined));
    const regex = new RegExp(search, "i");
    const a = data?.filter((item: Data) => {
      return (
        regex.test(item.name) ||
        regex.test(item.artists ?? "") ||
        regex.test(item.year)
      );
    });
    const b = a.filter((item: Data) => item?.id !== undefined);
    setFilteredData(b);
    setMaxPage(Math.ceil(b.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const handleIncrementPage = (value: number) => {
    if (currentPage + value < 1 || currentPage + value > maxPage) return;
    setCurrentPage(currentPage + value);
  };

  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);

  const handleSelected = (id: string, name: string) => {
    const index = selected.findIndex((item) => item.id === id);
    if (index === -1) {
      setSelected([...selected, { id, name }]);
    } else {
      const newSelected = [...selected];
      newSelected.splice(index, 1);
      setSelected(newSelected);
    }
  };

  const handleRemoveSelect = (index: number) => {
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    setSelected(newSelected);
  };

  const handleClickSubmit = () => {
    //TODO: call the API
    setSelectionPhase(false);
  };

  // =======================================
  // Grading results page
  const [selectionPhase, setSelectionPhase] = useState<boolean>(true);

  const [recommendations, setRecommendations] = useState<Data[]>([
    {
      id: "2mvn2MHPnPJeqgDrZKDnQZ",
      artists: "['Yelawolf']",
      name: "Catfish Billy 2",
      year: "2019",
    },
    {
      id: "2sqE9z7rJlzV5ZgieeUatU",
      artists: "['Matter and Energy']",
      name: "Orbital",
      year: "2019",
    },
    {
      id: "64BKKgWdKdmKlQDzRfHW3C",
      artists: "['Louis The Child', 'Drew Love']",
      name: "Free (with Drew Love)",
      year: "2019",
    },
  ]);

  const [recommendationSelected, setRecommendationSelected] = useState<
    string | null
  >(null);

  const handleSubmitGrading = () => {
    //TODO: call the API
    setThankYou(true);
  };

  // =======================================
  // Thank you page
  const [thankYou, setThankYou] = useState<boolean>(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {selectionPhase ? (
        <>
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 8,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a song..."
              onKeyDown={(ev: any) => {
                if (ev.key === "Enter") {
                  handleSearch();
                }
              }}
              style={{
                width: 400,
                border: "1px solid grey",
                borderRadius: 8,
                height: 32,
                fontSize: 16,
                paddingInline: 10,
              }}
            />
            <Button
              variant="contained"
              style={{ borderRadius: 8 }}
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ textTransform: "unset" }}
            >
              Search
            </Button>
            {selected.length > 0 && (
              <Button
                variant="contained"
                color="error"
                style={{ borderRadius: 8 }}
                startIcon={<Delete />}
                onClick={() => setSelected([])}
                sx={{ textTransform: "unset" }}
              >
                Delete all
              </Button>
            )}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 16, fontWeight: 500 }}>
              Select at least 5 songs to submit
            </span>
            <Button
              style={{ textTransform: "unset", borderRadius: 8 }}
              color="secondary"
              variant="contained"
              disabled={selected.length < 5}
              onClick={handleClickSubmit}
            >
              Submit
            </Button>
          </div>
          {selected.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: 8,
                flexWrap: "wrap",
              }}
            >
              {selected.map((item, index) => {
                return (
                  <div
                    style={{
                      borderRadius: 12,
                      height: 24,
                      maxWidth: 210,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "4px 8px",
                      textAlign: "center",
                      backgroundColor: "#cccccc",
                      display: "flex",
                      gap: 8,
                    }}
                    key={item.id}
                  >
                    <Tooltip
                      title={item.name}
                      enterDelay={500}
                      enterNextDelay={500}
                      arrow
                    >
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </span>
                    </Tooltip>
                    <span
                      style={{
                        fontSize: 16,
                        cursor: "pointer",
                        color: "white",
                        fontWeight: 600,
                      }}
                      onClick={() => handleRemoveSelect(index)}
                    >
                      X
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
              overflow: "auto",
              width: "100%",
            }}
          >
            {dataInPage?.map((item: Data) => {
              return (
                <div
                  key={item.id}
                  style={{
                    borderBlock: "1px solid grey",
                    padding: 6,
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelected(item.id, item.name)}
                >
                  <span>
                    <b>{item.name}</b>
                  </span>
                  <span>{item.artists}</span>
                  <span>{item.year}</span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              height: 40,
              alignSelf: "flex-end",
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              borderTop: "1px solid grey",
            }}
          >
            <IconButton
              disabled={currentPage === 1}
              onClick={() => handleIncrementPage(-1)}
            >
              <ArrowLeft />
            </IconButton>
            <span>{currentPage}</span>
            <IconButton
              disabled={currentPage === maxPage}
              onClick={() => handleIncrementPage(1)}
            >
              <ArrowRight />
            </IconButton>
          </div>
        </>
      ) : !thankYou ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            paddingTop: 16
          }}
        >
          <Typography fontSize={24} fontWeight={500} lineHeight={"30px"}>
            These are our suggestions. Pick your favorite one!
          </Typography>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {recommendations.map((item: Data) => {
              const selected = item.id === recommendationSelected;
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 12,
                    border: selected ? "2px solid red" : "1px solid grey",
                    padding: 8,
                    width: "25%",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    setRecommendationSelected(item.id);
                  }}
                  key={item.id}
                >
                  <Typography
                    fontSize={18}
                    fontWeight={600}
                    noWrap
                    lineHeight={"22px"}
                  >
                    {item.name}
                  </Typography>
                  <Typography noWrap lineHeight={"22px"}>
                    {item.artists}
                  </Typography>
                  <Typography noWrap lineHeight={"22px"}>
                    {item.year}
                  </Typography>
                </div>
              );
            })}
          </div>
          <Button
            disabled={!recommendationSelected}
            onClick={handleSubmitGrading}
            style={{ textTransform: "unset", width: "fit-content", borderRadius: 8 }}
            variant="contained"
            color="secondary"
          >
            Submit
          </Button>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={32} fontWeight={600}>
            Thank you for your time!
          </Typography>
        </div>
      )}
    </div>
  );
}

export default App;
