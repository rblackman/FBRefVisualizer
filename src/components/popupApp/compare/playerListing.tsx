import * as React from 'react';
import { FC, useContext } from 'react';
import { formatTime } from '../../../helpers/time';
import Player from '../../../types/player';
import Icon, { IconType } from '../../generic/icon';
import { AppContext } from '../appContext';
import { Actions } from '../reducer';
import Check from './check';

const PlayerListing: FC<Player> = (props: Player) => {
    const {
        id,
        info: {
            name
        },
        timestamp
    } = props;

    const { state, dispatch } = useContext(AppContext);
    const { selectedCompare } = state;

    const isSelected = selectedCompare.indexOf(id) >= 0;

    function onChange(): void {
        dispatch({ type: Actions.ToggleSelected, action: isSelected ? 'remove' : 'add', id });
    }

    function onRemove(): void {
        dispatch({ type: Actions.RemovePlayer, id });
    }

    return (
        <li className="player-row">
            <Check checked={isSelected} onChange={onChange} />
            <label htmlFor={id}>
                {name}
            </label>
            <input type="checkbox" checked={isSelected} onChange={onChange} id={id} />
            <button className="remove" onClick={onRemove}>
                <Icon iconType={IconType.Trash} />
            </button>
            <div className="date">
                {formatTime(timestamp)}
            </div>
        </li>
    );
};

export default PlayerListing;