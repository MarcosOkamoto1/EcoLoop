import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // LÓGICA DO CIDADÃO
  // ==========================================

  async create(citizenId: string, dto: CreateCollectionDto) {
    return this.prisma.collection.create({
      data: {
        citizenId,
        address: dto.address,
        scheduledDate: new Date(dto.scheduledDate),
        notes: dto.notes,
        status: 'PENDING',
        items: {
          create: dto.items.map((item) => ({
            name: item,
            category: 'Eletrônico',
          })),
        },
      },
    });
  }

  async findMyCollections(citizenId: string) {
    return this.prisma.collection.findMany({
      where: { citizenId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ==========================================
  // LÓGICA DA COOPERATIVA
  // ==========================================

  // Função auxiliar: Garante que a cooperativa existe no banco
  private async getOrCreateCooperative(userId: string) {
    let cooperative = await this.prisma.cooperative.findUnique({
      where: { userId },
    });

    // Se o usuário ainda não tem perfil de cooperativa, o sistema cria um automático para o MVP
    if (!cooperative) {
      cooperative = await this.prisma.cooperative.create({
        data: {
          userId,
          cnpj: userId, // Usamos o ID como CNPJ provisório para garantir que seja único
          address: 'Endereço da Cooperativa (Pendente)',
          latitude: 0,
          longitude: 0,
        },
      });
    }
    return cooperative;
  }

  async findPending() {
    return this.prisma.collection.findMany({
      where: { status: 'PENDING' },
      include: { citizen: { select: { name: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyAccepted(userId: string) {
    // Busca o ID real da Cooperativa antes de consultar
    const cooperative = await this.getOrCreateCooperative(userId);

    return this.prisma.collection.findMany({
      where: { cooperativeId: cooperative.id, status: 'ACCEPTED' },
      include: { citizen: { select: { name: true } }, items: true },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async accept(id: string, userId: string) {
    // Descobre qual é a Cooperativa vinculada a este usuário logado
    const cooperative = await this.getOrCreateCooperative(userId);

    return this.prisma.collection.update({
      where: { id },
      data: { status: 'ACCEPTED', cooperativeId: cooperative.id },
    });
  }

  async complete(id: string, userId: string) {
    const cooperative = await this.getOrCreateCooperative(userId);

    return this.prisma.collection.update({
      where: { id, cooperativeId: cooperative.id },
      data: { status: 'COMPLETED' },
    });
  }
}
