// apps/api/src/collections/collections.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(req.user.userId, dto);
  }

  @Get('pending')
  findPending() {
    return this.collectionsService.findPending();
  }

  @Get('my-accepted')
  findMyAccepted(@Request() req) {
    return this.collectionsService.findMyAccepted(req.user.userId);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Request() req) {
    return this.collectionsService.accept(id, req.user.userId);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Request() req) {
    return this.collectionsService.complete(id, req.user.userId);
  }

  @Get('my')
  findMyCollections(@Request() req) {
    return this.collectionsService.findMyCollections(req.user.userId);
  }
}
