import "./App.css";
import { useState, useRef, useEffect } from "react";
import { useSound } from "use-sound";
import diamondsound from "./assets/diamondsound.mp3";
import bombsound from "./assets/bombsound.mp3";
import akbetsound from "./assets/akbetsound.mp3";
import akdiamond from "./assets/akdiamond.mp3";
import khatam from "./assets/khatambomb.mp3";
function App() {
  const [bombmp3] = useSound(khatam);
  const [diamondmp3] = useSound(akdiamond, { interrupt: true });
  const [betsound] = useSound(akbetsound);
  const [mine, setMine] = useState(1);
  const [newgame, setNewgame] = useState(true);
  const [tiles, setTiles] = useState([]);
  const [disable, setDisable] = useState(false);
  const [gameon, setGameon] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [greenmines, setGreenmines] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const wallet = useRef(5000);
  useEffect(() => {
    let updatedarr = randomobjarr(mine);
    setTiles(updatedarr);
    setDisable(false);
    setShowmodal(false);
    setGreenmines(0);
    setMultiplier(1);
  }, [newgame]);
  function betonclick() {
    const nomine = document.getElementById("selectfield").value;
    const amount = document.getElementById("betamount").value;
    if (amount > wallet.current) {
      alert("insufficient balance:add funds");
      return;
    } else if (amount === "") {
      alert("Enter amount");
      return;
    }
    betsound();
    wallet.current = wallet.current - amount;
    setMine(nomine);
    setNewgame((x) => !x);
    setGameon(true);
  }
  function cashoutonclick() {
    setGameon(false);
    const updaterr = tiles.map((item) => ({ ...item, isflipped: true }));
    setShowmodal(true);
    setTiles(updaterr);
    handlemultiplier();
    document.getElementById("betamount").value = "";
  }
  function onclickhandler(id) {
    if (disable) {
      return;
    }
    const copycards = [...tiles];
    copycards[id].isflipped = true;
    copycards[id].selected = true;
    setTiles(copycards);
    if (copycards[id].bomb) {
      setDisable(true);
      setGameon(false);
      setGreenmines(0);
      setTimeout(() => {
        const updatedtiles = copycards.map((item) => ({
          ...item,
          isflipped: true,
        }));
        setTiles(updatedtiles);
        bombmp3();
        document.getElementById("betamount").value = "";
      }, 500);
    } else {
      setGreenmines((x) => x + 1);
      diamondmp3();
    }
  }
  useEffect(() => {
    const x = calculateMultiplier(greenmines, mine);
    setMultiplier(x);
  }, [greenmines]);

  function handlemultiplier() {
    const totalwin = document.getElementById("betamount").value * multiplier;
    wallet.current = wallet.current + totalwin;
  }
  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  function binomialCoefficient(n, k) {
    if (k > n) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
  }

  function calculateMultiplier(diamondsFlipped, mines) {
    const totalTiles = 25;
    const safeTiles = totalTiles - mines;

    const probability =
      binomialCoefficient(safeTiles, diamondsFlipped) /
      binomialCoefficient(totalTiles, diamondsFlipped);

    if (probability === 0) return 0;

    let multiplier = 1 / probability;

    // Apply house edge (e.g., 95% payout)
    //const houseEdge = 0.95;
    //multiplier *= houseEdge;

    return multiplier.toFixed(2);
  }
  return (
    <div className="bg-body h-screen flex justify-center">
      <div className="bg-container h-10/12 mt-10 w-8/12 justify-center p-2 flex flex-col rounded-lg sm:flex-row ">
        <div className="bg-leftside flex-2 rounded-t-lg p-4 justify-center sm:rounded-l-lg">
          <div className="flex mb-4">
            <div className="bg-body rounded-l-lg text-white font-semibold p-2 w-1/3 ml-auto text-center">
              {wallet.current}
            </div>
            <button className="text-gray-200 font-bold bg-indigo-700 rounded-r-lg p-2 hover:bg-indigo-600 mr-auto">
              Wallet
            </button>
          </div>
          <div className="text-gray-400">Bet Amount</div>
          <input
            id="betamount"
            disabled={gameon}
            placeholder="Enter amount"
            max={wallet.current}
            type="Number"
            className="bg-body rounded-lg text-gray-300 font-semibold p-4 w-1/1"
          ></input>
          <div className="text-gray-400">Mines</div>
          <select
            disabled={gameon}
            id="selectfield"
            placeholder="number of mines"
            type="Number"
            className="bg-body rounded-lg text-gray-300 font-semibold p-4 w-1/1"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
          </select>
          {gameon ? (
            <div>
              <div className="text-gray-300">total profit: x{multiplier}</div>
              <div
                disabled={greenmines === 0}
                onClick={cashoutonclick}
                className="bg-betbutton hover:bg-abetbutton pt-2 pb-2 pr-8 pl-8 rounded-sm mt-4 text-center hover:cursor-pointer"
              >
                Cashout
              </div>
            </div>
          ) : (
            <div
              onClick={betonclick}
              className="bg-betbutton hover:bg-abetbutton pt-2 pb-2 pr-8 pl-8 rounded-sm mt-4 text-center hover:cursor-pointer"
            >
              Bet
            </div>
          )}
        </div>
        <div className="bg-rightside relative flex-4 rounded-b-lg grid grid-cols-5 grid-rows-5 gap-x-3 gap-y-3 p-4 sm:rounded-r-lg ">
          {showmodal ? (
            <div className="bg-body w-32 h-32 flex p-12 opacity-60 z-1 absolute top-5/10 left-5/10 -translate-y-7/10 -translate-x-5/10 text-abetbutton rounded-lg border-6 border-abetbutton font-bold">
              x{multiplier}
            </div>
          ) : (
            ""
          )}
          {tiles.map((item) => {
            return (
              <button
                disabled={disable || !gameon || item.isflipped}
                key={item.id}
                onClick={() => {
                  onclickhandler(item.id);
                }}
                className={`rounded-lg transition delay-20 duration-300 ${
                  item.isflipped
                    ? item.bomb
                      ? item.selected
                        ? "bg-red-500"
                        : "bg-red-800"
                      : item.selected
                      ? "bg-green-500"
                      : "bg-green-800"
                    : "bg-tile hover:-translate-y-1 cursor-pointer"
                }`}
              ></button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function randomobjarr(mine) {
  let arr = new Array(25);
  arr.fill({});
  let randomarr = randomvalgen(mine);
  arr = arr.map((item, index) => {
    if (randomarr.includes(index)) {
      return (item = {
        id: index,
        bomb: true,
        isflipped: false,
        selected: false,
      });
    } else {
      return (item = {
        id: index,
        bomb: false,
        isflipped: false,
        selected: false,
      });
    }
  });
  return arr;
}
function randomvalgen(mine) {
  let set = new Set();
  while (set.size < mine) {
    set.add(Math.floor(Math.random() * 25));
  }
  return Array.from(set);
}
export default App;
