export class CreatePostDTO {
  readonly title: string;
  readonly content: string;
  // userId should be taken from the token
  readonly userId: number;
}
