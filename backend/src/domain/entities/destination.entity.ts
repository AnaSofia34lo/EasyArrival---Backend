export class Destination {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
  ) {}
}
