import Player from './player';


export enum Command {
    Download,
    DownloadDone,
    Launch,
    SetIcon,
    AddToCompare,
    Close,
    RequestLoadStatus
}

interface MessageBase {
    command: Command;
}

export interface LaunchMessage extends MessageBase {
    command: Command.Launch;
}

export interface DownloadDoneMessage extends MessageBase {
    command: Command.DownloadDone;
    dataUrl: string;
}

export interface DownloadMessage extends MessageBase {
    command: Command.Download;
}

export interface SetIconMessage extends MessageBase {
    command: Command.SetIcon;
    status: boolean;
}

export interface AddToCompareMessage extends MessageBase {
    command: Command.AddToCompare;
    player: Player;
}

export interface CloseMessage extends MessageBase {
    command: Command.Close;
}

export interface RequestLoadStatusMessage extends MessageBase {
    command: Command.RequestLoadStatus;
}

export type Message = LaunchMessage |
    DownloadDoneMessage |
    DownloadMessage |
    SetIconMessage |
    AddToCompareMessage |
    CloseMessage |
    RequestLoadStatusMessage;