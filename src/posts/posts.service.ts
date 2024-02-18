import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dto/CreatePostDTO';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from '../files/files.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private filesService: FilesService,
  ) {}

  async create(dto: CreatePostDTO, image: any) {
    const fileName = await this.filesService.createFile(image);

    return await this.postRepository.create({ ...dto, image: fileName });
  }
}
