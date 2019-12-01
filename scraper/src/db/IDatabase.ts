export default interface IDatabase {
  query(query: string): Promise<any>,
  close(): Promise<void>,
  connect(): Promise<void>
}