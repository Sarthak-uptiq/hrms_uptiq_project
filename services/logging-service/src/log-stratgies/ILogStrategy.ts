export interface ILogStrategy {
    logEvent(payload: any): Promise<void>;
}