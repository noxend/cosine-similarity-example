export default interface IDatabase {
  query(query: string): Promise<void>,
  close(): Promise<void>,
  connect(): Promise<void>
}