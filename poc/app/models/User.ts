import { Model } from "../setup/decorators/Model"

@Model({ table: 'users' })
export class User {
  constructor(
    private readonly email: string,
    private readonly username: string,
    private readonly fullname: string
  ) {}
}
