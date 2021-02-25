import React from "react";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import { GSI, actions } from "./../../App";
import MapSeries from "../MapSeries/MapSeries";


interface Props {
  game: CSGO,
  match: Match | null
}

interface State {
  winner: Team | null,
  showWin: boolean,
  forceHide: boolean
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      winner: null,
      showWin: false,
      forceHide: false
    }
  }

  componentDidMount() {
    GSI.on('roundEnd', score => {
      this.setState({ winner: score.winner, showWin: true }, () => {
        setTimeout(() => {
          this.setState({ showWin: false })
        }, 4000)
      });
    });
    actions.on("boxesState", (state: string) => {
      if (state === "show") {
        this.setState({ forceHide: false });
      } else if (state === "hide") {
        this.setState({ forceHide: true });
      }
    });
  }

  getVeto = () => {
    const { game, match } = this.props;
    const { map } = game;
    if (!match) return null;
    const mapName = map.name.substring(map.name.lastIndexOf('/') + 1);
    const veto = match.vetos.find(veto => veto.mapName === mapName);
    if (!veto) return null;
    return veto;
  }

  render() {
    const { game, match } = this.props;
    const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
    const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

    const leftPlayers = game.players.filter(player => player.team.side === left.side);
    const rightPlayers = game.players.filter(player => player.team.side === right.side);
    const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";
    const { forceHide } = this.state;

    return (
      <div className="layout">
        <MapSeries teams={[left, right]} match={match} isFreezetime={isFreezetime} map={game.map} />
      </div>
    );
  }
}
