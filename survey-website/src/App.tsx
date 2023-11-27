import { useState } from "react"
import "./App.css"

import { Button, Grid, Radio, Tooltip, Typography } from "@mui/material"
import { Delete, Search } from "@mui/icons-material"
import MusicAudioDisplay from "./music-audio-display"
import Confetti from "react-confetti"
export interface Data {
  id: string
  artists: string[] | undefined
  name: string
  year: string
}

interface ISubmissionObject {
  track_ids: string[]
  r1_id: string
  r2_id: string
  r3_id: string
  r4_id: string
  relevance: number
  diversity: number
  genre: number
  mood: number
  general: number
}

const url = process.env.REACT_APP_BE_URL ?? ""

const criteria = [
  {
    name: "Relevance",
    description: "Which song is the most relevant to the ones you selected?",
  },
  {
    name: "Diversity",
    description:
      "Which song is most different while still being relevant to the ones you selected?",
  },
  {
    name: "Genre",
    description:
      "Which song best represents the genre of the ones you selected?",
  },
  {
    name: "Mood",
    description:
      "Which song best represents the mood of the ones you selected?",
  },
  {
    name: "General",
    description:
      "Which song is the best suggestion based on the ones you selected?",
  },
]

function App() {
  const [search, setSearch] = useState<string>("")
  //Null if not yet searched
  const [dataInPage, setDataInPage] = useState<Data[] | null>(null)

  const handleSearch = () => {
    fetch(`${url}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: search, size: 50 }),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log("Res", res);
        setDataInPage(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const [selected, setSelected] = useState<{ id: string; name: string }[]>([])

  const handleSelected = (id: string, name: string) => {
    const index = selected.findIndex((item) => item.id === id)
    if (index === -1) {
      if (selected.length < 5) setSelected([...selected, { id, name }])
    } else {
      const newSelected = [...selected]
      newSelected.splice(index, 1)
      setSelected(newSelected)
    }
  }

  const handleRemoveSelect = (index: number) => {
    const newSelected = [...selected]
    newSelected.splice(index, 1)
    setSelected(newSelected)
  }

  const handleClickSubmit = () => {
    fetch(`${url}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        track_ids: selected.map((song) => song.id),
        n: 1,
      }),
    })
      .then((res) => res.json())
      .then((res: { 1: any[]; 2: any[]; 3: any[]; 4: any[] }[]) => {
        const resultArray = ([] as any[]).concat(...Object.values(res))
        setSubmissionObject({
          track_ids: selected.map((song) => song.id),
          r1_id: resultArray[0].id,
          r2_id: resultArray[1].id,
          r3_id: resultArray[2].id,
          r4_id: resultArray[3].id,
          relevance: 0,
          diversity: 0,
          genre: 0,
          mood: 0,
          general: 0,
        })
        setRecommendations(resultArray)
      })
      .catch((err) => {
        console.log(err)
      })
    setSelectionPhase(false)
  }

  // =======================================
  // Grading results page
  const [selectionPhase, setSelectionPhase] = useState<boolean>(true)

  const [recommendations, setRecommendations] = useState<Data[]>([])

  const [submissionObject, setSubmissionObject] = useState<ISubmissionObject>(
    {} as ISubmissionObject
  )

  const [gradings, setGradings] = useState<number[]>([0, 0, 0, 0, 0])

  const handleSubmitGrading = () => {
    const submitObject = {
      ...submissionObject,
      relevance: gradings[0],
      diversity: gradings[1],
      genre: gradings[2],
      mood: gradings[3],
      general: gradings[4],
    }
    fetch(`${url}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitObject),
    }).then((_) => {
      setThankYou(true)
    })
  }

  const resetApp = () => {
    setSearch("")
    setDataInPage(null)
    setSelected([])
    setSelectionPhase(true)
    setRecommendations([])
    setSubmissionObject({} as ISubmissionObject)
    setGradings([0, 0, 0, 0, 0])
    setThankYou(false)
  }

  // =======================================
  // Thank you page
  const [thankYou, setThankYou] = useState<boolean>(false)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div id="embed-iframe" />
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
                  handleSearch()
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
              style={{ borderRadius: 8, minWidth: 90 }}
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ textTransform: "unset" }}
            >
              Search
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
                )
              })}
              {selected.length === 5 && <div style={{ color: "red" }}>5/5</div>}
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
            {dataInPage === null ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: `#888888`,
                  fontSize: 28,
                }}
              >
                Search your favorite songs with the search bar!
              </div>
            ) : (
              dataInPage?.map((item: Data) => {
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
                    <span>{item.artists?.join(", ")}</span>
                    <span>{item.year}</span>
                  </div>
                )
              })
            )}
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            {selected.length > 0 && (
              <Button
                variant="contained"
                color="error"
                style={{ borderRadius: 8 }}
                startIcon={<Delete />}
                onClick={() => setSelected([])}
                sx={{ textTransform: "unset" }}
              >
                Delete
              </Button>
            )}
            <div style={{ flex: 1 }} />
            <Button
              style={{ textTransform: "unset", borderRadius: 8 }}
              color="secondary"
              variant="contained"
              onClick={handleClickSubmit}
              disabled={selected.length === 0}
            >
              Submit
            </Button>
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
            padding: 16,
            boxSizing: "border-box",
          }}
        >
          <Typography fontSize={24} fontWeight={500} lineHeight={"30px"}>
            These are our suggestions
          </Typography>
          <Grid container spacing={2}>
            {recommendations.map((item: Data) => {
              return (
                <Grid key={item.id} item xs={12} sm={6} xl={3}>
                  <MusicAudioDisplay song={item} />
                </Grid>
              )
            })}
          </Grid>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <Typography fontSize={26} fontWeight={500} lineHeight={"30px"}>
              Give us your feedback regarding our suggestions.
            </Typography>
            <Typography
              fontSize={18}
              fontWeight={500}
              lineHeight={"24px"}
              color={"#888888"}
              paddingBottom={3}
            >
              We will ask you to select the best song in your opinion based on
              different criteria.
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "center",
              }}
            >
              {criteria.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      width: "100%",
                    }}
                  >
                    <Typography
                      fontSize={24}
                      fontWeight={500}
                      lineHeight={"24px"}
                    >
                      {index + 1}. {item.name}
                    </Typography>
                    <Typography
                      fontSize={16}
                      fontWeight={500}
                      lineHeight={"22px"}
                      color={"#888888"}
                    >
                      {item.description}
                    </Typography>
                    <Grid container style={{ display: "flex", width: "100%" }}>
                      {recommendations.map((song, index2) => {
                        return (
                          <Grid
                            key={index2}
                            item
                            xs={12}
                            lg={3}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              overflow: "hidden",
                            }}
                            onClick={() => {
                              const newGradings = [...gradings]
                              newGradings[index] = index2 + 1
                              setGradings(newGradings)
                            }}
                          >
                            <Radio checked={gradings[index] === index2 + 1} />
                            <Typography
                              fontSize={16}
                              fontWeight={500}
                              lineHeight={"22px"}
                            >
                              {song.name}
                            </Typography>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </div>
                )
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              paddingBottom: 12,
            }}
          >
            <Button
              disabled={gradings.includes(0)}
              onClick={handleSubmitGrading}
              style={{
                textTransform: "unset",
                width: "fit-content",
                borderRadius: 8,
              }}
              variant="contained"
              color="secondary"
            >
              Submit
            </Button>
          </div>
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
          <Confetti />
          <Typography fontSize={24} fontWeight={600} paddingBottom={3}>
            Thank you for your time!
          </Typography>
          <Button
            color="primary"
            onClick={resetApp}
            variant="contained"
            style={{ borderRadius: 8 }}
          >
            Search again!
          </Button>
        </div>
      )}
    </div>
  )
}

export default App
