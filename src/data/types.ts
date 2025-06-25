export interface Patient {
  id: number;
  firstname: string;
  secondname?: string;
  surname: string;
  age: number;
  gender: string;
  photoUrl?: string;
  userId: number;
}
