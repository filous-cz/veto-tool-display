import React from "react";
import * as I from "csgogsi-socket";
import { Match, Veto } from '../../api/interfaces';
import TeamLogo from "../MatchBar/TeamLogo";
import "./mapseries.scss";
import {LogoCT, LogoT} from '../../assets/Icons';

interface IProps {
    match: Match | null;
    teams: I.Team[];
    isFreezetime: boolean;
    map: I.Map
}

interface IVetoProps {
    veto: Veto;
    teams: I.Team[];
    active: boolean;
}

class VetoEntry extends React.Component<IVetoProps> {
    render(){
        const { veto, teams } = this.props;
        return <div className={`veto_container ${veto.mapName} ${veto.type === "ban" ? "ban" : ""}${veto.type === "pick" ? "pick" : ""}${veto.type === "decider" ? "decider" : ""}`}>
            <div className="veto_map_name">
                {veto.mapName.replace("de_","")}
            </div>
            <div className="bar"><div>{veto.type}</div></div>
            <div className="veto_picker">
                <TeamLogo team={teams.filter(team => team.id === veto.teamId)[0]} />
            </div>

            <div className={`sidepickbar ${veto.side === "NO" ? "hidden" : ""}`}>
                <TeamLogo team={teams.filter(team => team.id !== veto.teamId)[0]} />
                <div className="arrow"></div>
                <img src={veto.side === "CT" ? LogoCT : LogoT} />
            </div>
            
        </div>
    }
}

export default class MapSeries extends React.Component<IProps> {

    render() {
        const { match, teams, isFreezetime, map } = this.props;
        if (!match || !match.vetos.length) return null;
        return (
            <div className={`map_series_container`}>
                {match.vetos.map(veto => {
                    if(!veto.mapName) return null;
                    return <VetoEntry key={`${match.id}${veto.mapName}${veto.teamId}${veto.side}`} veto={veto} teams={teams} active={map.name.includes(veto.mapName)}/>
                })}
            </div>
        );
    }
}
