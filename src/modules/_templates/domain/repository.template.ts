export interface ExampleEntity {
  id: string;
}

export interface ExampleRepository {
  findById(id: string): Promise<ExampleEntity | null>;
}
