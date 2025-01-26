import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Egg {
  id: number;
  side: string;
  progress: number;
  startTime?: number;
}

function App() {
  // Стейты яиц, позиции волка и счет
  const [leftEggs, setLeftEggs] = useState<Egg[]>([]);
  const [rightEggs, setRightEggs] = useState<Egg[]>([]);
  const [position, setPosition] = useState<string>("center");
  const [score, setScore] = useState<number>(0);

  // Создаем яйца
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 10000);
      const egg = {
        id: random,
        side: random % 2 === 0 ? "left" : "right",
        progress: 0,
      };
      console.log(egg);
      setLeftEggs((prev) => (egg.side === "left" ? [...prev, egg] : prev));
      setRightEggs((prev) => (egg.side === "right" ? [...prev, egg] : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Логика падения яиц (к каждому яйцу добавляется 25% прогресса)
  useEffect(() => {
    const fallEggs = () => {
      const currentTime = Date.now();

      setLeftEggs((prev) =>
        prev.map((egg) => {
          if (egg.progress === 0) {
            if (!egg.startTime) {
              egg.startTime = currentTime;
            }

            const elapsedTime = currentTime - egg.startTime;

            if (elapsedTime >= 300) {
              return { ...egg, progress: egg.progress + 25 };
            }
          }

          // Обновляем яйца, если их прогресс больше 0
          return egg.progress > 0
            ? { ...egg, progress: egg.progress + 25 }
            : egg;
        })
      );

      setRightEggs((prev) =>
        prev.map((egg) => {
          if (egg.progress === 0) {
            if (!egg.startTime) {
              egg.startTime = currentTime;
            }

            const elapsedTime = currentTime - egg.startTime;

            if (elapsedTime >= 500) {
              return { ...egg, progress: egg.progress + 25 };
            }
          }

          return egg.progress > 0
            ? { ...egg, progress: egg.progress + 25 }
            : egg;
        })
      );
    };

    const fallIntervalId = setInterval(fallEggs, 1000);

    return () => clearInterval(fallIntervalId);
  }, []);

  // Проверка на попадание в яйцо
  useEffect(() => {
    const checkCatch = () => {
      setLeftEggs((prev) =>
        prev.filter((egg) => {
          if (egg.progress >= 125) {
            if (position === "left") {
              setScore((prevScore) => prevScore + 1);
              return false;
            }
            console.log("Пропустил яйцо слева!");
            return false;
          }
          return true;
        })
      );

      setRightEggs((prev) =>
        prev.filter((egg) => {
          if (egg.progress >= 125) {
            if (position === "right") {
              setScore((prevScore) => prevScore + 1);
              return false;
            }
            console.log("Пропустил яйцо справа");
            return false;
          }
          return true;
        })
      );
    };
    const checkIntervalId = setInterval(checkCatch, 100);
    return () => clearInterval(checkIntervalId);
  }, [position, leftEggs, rightEggs]);

  // useEffect(() => {
  //   console.log(leftEggs, rightEggs);
  // }, [leftEggs, rightEggs]);

  const onLeft = () => setPosition("left");
  const onRight = () => setPosition("right");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyA") {
        onLeft();
      } else if (event.code === "KeyD") {
        onRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Grid
        container
        sx={{ justifyContent: "center", mt: "100px", gap: "200px" }}
      >
        <Grid>
          <Box
            component="div"
            id="leftBlock"
            sx={{
              width: "500px",
              height: "50px",
              bgcolor: "red",
              transform: "rotate(20deg)",
              position: "relative",
            }}
          >
            {leftEggs.map((egg) => (
              <Box
                key={egg.id}
                component="div"
                id="leftEgg"
                sx={{
                  height: "25px",
                  width: "25px",
                  bgcolor: "yellow",
                  position: "absolute",
                  left: `${egg.progress}%`,
                  transition: "all 1s linear",
                  // transform: `translateX(${egg.progress}%)`,
                }}
              ></Box>
            ))}
          </Box>
        </Grid>
        <Grid>
          <Box
            component="div"
            id="rightBlock"
            sx={{
              width: "500px",
              height: "50px",
              bgcolor: "red",
              transform: "rotate(-20deg)",
              position: "relative",
            }}
          >
            {rightEggs.map((egg) => (
              <Box
                key={egg.id}
                component="div"
                id="leftEgg"
                sx={{
                  height: "25px",
                  width: "25px",
                  bgcolor: "yellow",
                  position: "absolute",
                  right: `${egg.progress}%`,
                  transition: "all 1s linear",
                  // transform: `translateX(-${egg.progress}%)`,
                }}
              ></Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        direction={"column"}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <Grid>
          <Box
            component="div"
            id="wolf"
            sx={{
              height: "200px",
              width: "50px",
              bgcolor: "black",
              mt: "100px",
              transform:
                position === "left"
                  ? "rotate(-30deg)"
                  : position === "right"
                  ? "rotate(30deg)"
                  : "rotate(0deg)",
            }}
          ></Box>
        </Grid>
        <Grid container spacing={2} sx={{ mt: "20px" }}>
          <Button variant="contained" onClick={onLeft}>
            LEFT
          </Button>
          <Button variant="contained" onClick={onRight}>
            RIGHT
          </Button>
        </Grid>
        <Grid>
          <Typography variant="h4">Score: {score}</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
